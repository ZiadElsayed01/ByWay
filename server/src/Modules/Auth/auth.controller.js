import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  sentOTP,
  verifyOTP,
  forgetPassword,
  refreshToken,
} from "./Services/auth.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/error.handler.middleware.js";
const authRouter = Router();

authRouter.post("/register", errorHandlerMiddleware(register));
authRouter.get("/verify/:token", errorHandlerMiddleware(verifyEmail));
authRouter.post("/login", errorHandlerMiddleware(login));
authRouter.post("/send-otp", errorHandlerMiddleware(sentOTP));
authRouter.post("/verify-otp", errorHandlerMiddleware(verifyOTP));
authRouter.post("/forget-password", errorHandlerMiddleware(forgetPassword));
authRouter.post("/refresh-token", errorHandlerMiddleware(refreshToken));

export default authRouter;
