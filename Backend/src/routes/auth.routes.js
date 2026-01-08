import express from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/UserAuth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/login",loginUser);
authRouter.post("/logout",authMiddleware,logoutUser);
authRouter.post("/register",registerUser);

export default authRouter;

