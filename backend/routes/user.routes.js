import { Router } from "express";
import {
  userController,
  userloginController,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/register", userController);

userRouter.post("/login", userloginController);

export default userRouter;
