import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  sendOTP,
  verifyOTP,
  forgetPassword,
  refreshToken,
  logout,
} from "./Services/auth.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/error.handler.middleware.js";
const authRouter = Router();

authRouter.post("/register", errorHandlerMiddleware(register));
authRouter.post("/verify/:token", errorHandlerMiddleware(verifyEmail));
authRouter.post("/login", errorHandlerMiddleware(login));
authRouter.post("/send-otp", errorHandlerMiddleware(sendOTP));
authRouter.post("/verify-otp", errorHandlerMiddleware(verifyOTP));
authRouter.post("/forget-password", errorHandlerMiddleware(forgetPassword));
authRouter.post("/refresh-token", errorHandlerMiddleware(refreshToken));
authRouter.post("/logout", errorHandlerMiddleware(logout));

export default authRouter;
