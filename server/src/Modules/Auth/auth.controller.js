import { Router } from "express";
import { register, verifyEmail, login } from "./Services/auth.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/error.handler.middleware.js";
const authRouter = Router();

authRouter.post("/register", errorHandlerMiddleware(register));
authRouter.get("/verify/:token", errorHandlerMiddleware(verifyEmail));
authRouter.post("/login", errorHandlerMiddleware(login));

export default authRouter;
