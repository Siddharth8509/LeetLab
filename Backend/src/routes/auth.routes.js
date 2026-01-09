import express from "express";
import { registerUser,loginUser,logoutUser,adminRegister } from "../controllers/UserAuth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const authRouter = express.Router();

authRouter.post("/login",loginUser);
authRouter.post("/logout",authMiddleware,logoutUser);
authRouter.post("/register",registerUser);
authRouter.post("/admin/register",adminMiddleware,adminRegister);

export default authRouter;