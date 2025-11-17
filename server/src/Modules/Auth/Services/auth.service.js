import usersModel from "../../../DB/Models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyEmailTemplate } from "../../../Utils/verify.email.template.js";
import emitter from "../../../Services/send.email.service.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
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
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful",
    token,
    refreshToken,
  });
};
