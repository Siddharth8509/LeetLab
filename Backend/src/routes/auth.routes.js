import express from "express";
import { registerUser, loginUser, logoutUser, adminRegister, deleteUser, getUserProfile, getAllUsers, updateUser } from "../controllers/UserAuth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.post("/register", registerUser);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/delete/:id", authMiddleware, deleteUser);
authRouter.get("/admin/users", adminMiddleware, getAllUsers);
authRouter.put("/admin/user/:id", adminMiddleware, updateUser);
authRouter.get("/profile", authMiddleware, getUserProfile);
authRouter.get("/check", authMiddleware, (req, res) => {
    const reply = {
        firstname: req.result.firstname,
        lastname: req.result.lastname,
        emailId: req.result.emailId,
        role: req.result.role,
        _id: req.result._id
    };
    res.status(200).json({
        user: reply,
        message: "User registered successfully"
    });
});

export default authRouter; 