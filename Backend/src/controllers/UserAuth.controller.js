import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/user.js";
import redisClient from "../config/redis.js";
import authValidate from "../utils/authValidator.js";
import submission from "../model/submission.js"
import user from "../model/user.js";

const registerUser = async (req, res) => {
    try {
        authValidate(req.body);

        req.body.role = "user";
        const { password, ...data } = req.body;
        const emailId = req.body.emailId;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ password: hashedPassword, ...data });

        const token = jwt.sign({ _id: newUser._id, emailId: emailId, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        const userData = await User.findOne({ emailId });
        const reply = {
            _id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            emailId: userData.emailId,
            role: userData.role
        }

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        res.status(201).json({
            user: reply,
            message: "User registered successfully"
        });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId)
            throw new Error("Invalid credentials");
        if (!password)
            throw new Error("Invalid credentials");

        const userData = await User.findOne({ emailId });
        if (!userData)
            throw new Error("User doesn't exist");

        const realPassword = userData.password;

        const verifyPassword = await bcrypt.compare(password, realPassword);
        if (!verifyPassword)
            throw new Error("Enter a valid password");

        const token = jwt.sign({ _id: userData._id, emailId: emailId, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const reply = {
            _id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            emailId: userData.emailId,
            role: userData.role
        }

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        res.status(202).json({
            user: reply,
            message: "User registered successfully"
        });
    }
    catch (error) {
        res.status(401).send(error.message)
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const payload = jwt.decode(token);
            if (payload && payload.exp) {
                const expTime = payload.exp;
                await redisClient.set(`token:${token}`, "Blocked");
                await redisClient.expireAt(`token:${token}`, expTime);
            }
        }
    }
    catch (error) {
        console.error("Logout warning:", error.message);
    }
    finally {
        res.clearCookie("token");
        res.status(200).send("Logout successfully");
    }
}

const adminRegister = async (req, res) => {
    try {
        authValidate(req.body);

        req.body.role = "admin";
        const { password, ...data } = req.body;
        const emailId = req.body.emailId;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ password: hashedPassword, ...data });

        const token = jwt.sign({ _id: newUser._id, emailId: emailId, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        res.status(201).send("User created successfully!");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.userId;
        if (!id)
            return res.status(401).send("Invalid token");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("Invalid user id");

        const userExist = await User.findById(id);
        if (!userExist)
            return res.status(404).send("user does not exist");

        await submission.deleteMany({ userId: id });
        await User.findByIdAndDelete(id);

        return res.status(200).send("user deleted successfully");
    }
    catch (error) {
        res.status(500).send("Unexpected error occured :" + error.message);
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // Middleware should set this
        // Use 'User' (capital U) as imported in the file line 5: import User from "../model/user.js";
        // Also import is: import user from "../model/user.js"; on line 9. It's redundant but I must use one.
        // The existing code uses 'User' in register/login.

        const userInfo = await User.findById(userId).populate({
            path: "problemSolved",
            select: "difficulty"
        });

        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalSolved = userInfo.problemSolved.length;
        const easySolved = userInfo.problemSolved.filter(p => p.difficulty === "easy").length;
        const mediumSolved = userInfo.problemSolved.filter(p => p.difficulty === "medium").length;
        const hardSolved = userInfo.problemSolved.filter(p => p.difficulty === "hard").length;

        // Populate problemId to get title and difficulty
        const recentSubmissions = await submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("problemId", "title difficulty");

        res.status(200).json({
            user: {
                _id: userInfo._id,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.emailId,
                role: userInfo.role,
                username: userInfo.firstname // or however you want to display it
            },
            stats: {
                totalSolved,
                easySolved,
                mediumSolved,
                hardSolved
            },
            recentSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile: " + error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        // Pagination logic if needed, for now fetch all non-admin users or just all users
        const users = await User.find({}).select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid user ID");
        }

        // Prevent password update via this general endpoint if needed, or hash it if allowed
        // For now, let's assume we are updating role or basic info. 
        // If password is included, we should hash it.
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
    }
}

export { registerUser, logoutUser, loginUser, adminRegister, deleteUser, getUserProfile, getAllUsers, updateUser };