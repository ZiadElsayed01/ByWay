import usersModel from "../../../DB/Models/users.model.js";
import blacklisttokensModel from "../../../DB/Models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyEmailTemplate } from "../../../Utils/verify.email.template.js";
import emitter from "../../../Services/send.email.service.js";
import cryptoJS from "crypto-js";
import { verifyOTPTemplate } from "../../../Utils/verify.otp.template.js";
import { v4 as uuidv4 } from "uuid";
import { TOKEN_TYPES } from "../../../Constants/constants.js";
uuidv4();

export const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await usersModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, +process.env.SALT);

  const newUser = await usersModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  const verifyEmailToken = jwt.sign(
    { id: newUser._id, email },
    process.env.JWT_VERIFY_EMAIL_SECRET,
    { expiresIn: "1h" }
  );

  newUser.verificationToken = verifyEmailToken;
  newUser.verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await newUser.save();

  const verificationLink = `${req.protocol}://${req.headers.host}/api/auth/verify/${verifyEmailToken}`;

  emitter.emit("sendEmail", {
    to: email,
    subject: "Verify your email",
    html: verifyEmailTemplate(verificationLink),
  });

  return res.status(201).json({
    message: "User created successfully, check your email for verification",
    verifyEmailToken,
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_EMAIL_SECRET);

    const user = await usersModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Date.now() > user.verificationTokenExpiry) {
      return res.status(400).json({ message: "Token expired" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await usersModel.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: {
          verificationToken: "",
          verificationTokenExpiry: "",
        },
      }
    );

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res
      .status(400)
      .json({ message: "Cannot login, verify your email first" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET_LOGIN,
    { expiresIn: "1h", jwtid: uuidv4() }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d", jwtid: uuidv4() }
  );

  return res.status(200).json({
    message: "Login successful",
    token,
    refreshToken,
  });
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOTP = cryptoJS.AES.encrypt(
    otp,
    process.env.ENCRYPT_SECRET
  ).toString();

  user.otp = encryptedOTP;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  emitter.emit("sendEmail", {
    to: email,
    subject: "OTP Verification",
    html: verifyOTPTemplate(otp),
  });

  return res.status(200).json({ message: "OTP sent successfully" });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "email not found" });
  }

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const decryptedOTP = cryptoJS.AES.decrypt(
    user.otp,
    process.env.ENCRYPT_SECRET
  ).toString(cryptoJS.enc.Utf8);

  if (decryptedOTP !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await usersModel.updateOne(
    { _id: user._id },
    {
      $unset: {
        otp: "",
        otpExpiry: "",
      },
    }
  );

  return res.status(200).json({ message: "OTP verified successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!email || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "email not found" });
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res
      .status(400)
      .json({ message: "New password cannot be same as old password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, +process.env.SALT);

  await usersModel.updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
    }
  );

  return res.status(200).json({ message: "Password reset successfully" });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await usersModel.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_LOGIN,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
};

export const logout = async (req, res) => {
  const { token, refreshToken } = req.body;

  if (!token || !refreshToken) {
    return res
      .status(400)
      .json({ message: "Token and refresh token are required" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN);

  const decodedRefresh = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  await blacklisttokensModel.insertMany([
    {
      tokenId: decoded.jti,
      type: TOKEN_TYPES.ACCESS,
      expiredAt: new Date(decoded.exp * 1000),
    },
    {
      tokenId: decodedRefresh.jti,
      type: TOKEN_TYPES.REFRESH,
      expiredAt: new Date(decodedRefresh.exp * 1000),
    },
  ]);

  return res.status(200).json({ message: "Logout successful" });
};
