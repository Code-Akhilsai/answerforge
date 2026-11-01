import { Router } from "express";
import {
  userController,
  userloginController,
  googleAuthController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/register", userController);

userRouter.post("/login", userloginController);

userRouter.post("/google", googleAuthController);

userRouter.post("/forgot-password", forgotPasswordController);

userRouter.post("/reset-password/:token", resetPasswordController);

export default userRouter;
