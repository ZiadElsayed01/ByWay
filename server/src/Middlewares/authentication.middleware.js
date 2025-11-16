import jwt from "jsonwebtoken";
import User from "../DB/Models/user.model.js";
import BlacklistToken from "../DB/Models/blacklist.model.js";

export const authenticationMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Unauthorized, please login!" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_LOGIN);

    const isBlacklisted = await BlacklistToken.findOne({
      tokenId: data.jti,
    });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized, please login!" });
    }

    const user = await User.findOne({ id: data.id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, please login!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};
