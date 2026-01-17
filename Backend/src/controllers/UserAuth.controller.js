import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User  from "../model/user.js";
import redisClient from "../config/redis.js";
import authValidate from "../utils/authValidator.js";
import submission from "../model/submission.js"
import user from "../model/user.js";

const registerUser = async(req,res)=>{
    try 
    {
        authValidate(req.body);
        
        req.body.role = "user";
        const {password , ...data} = req.body;
        const emailId = req.body.emailId;
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({password : hashedPassword ,...data});

        const token = jwt.sign({_id:newUser._id,emailId:emailId,role:newUser.role},process.env.JWT_SECRET,{expiresIn : 60*60});
        
        const userData = await User.findOne({emailId});
        const reply = {
            _id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            emailId: userData.emailId,
            role: userData.role
        }

        res.cookie("token",token,{maxAge : 60*60*1000});
        res.status(201).json({
            user : reply,
            message : "User registered successfully"
        });
    } 
    catch (error) 
    {
        res.status(400).send(error.message);
    }
}

const loginUser = async(req,res)=>{
    try 
    {
        const {emailId , password} = req.body;
        
        if(!emailId)
            throw new Error("Invalid credentials");
        if(!password)
            throw new Error("Invalid credentials");

        const userData = await User.findOne({emailId});
        if(!userData)
            throw new Error("User doesn't exist");

        const realPassword = userData.password;

        const verifyPassword = await bcrypt.compare(password,realPassword);
        if(!verifyPassword)
            throw new Error("Enter a valid password");

        const token = jwt.sign({_id:userData._id,emailId:emailId,role:userData.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        const reply = {
            _id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            emailId: userData.emailId,
            role: userData.role
        }

        res.cookie("token",token,{maxAge:60*60*1000});
        res.status(202).json({
            user : reply,
            message : "User registered successfully"
        });
    } 
    catch (error) 
    {
        res.status(401).send(error.message)
    }
}

const logoutUser = async(req,res)=>{
    try 
    {
        const token = req.cookies?.token;
        const payload = jwt.decode(token);
        const expTime = payload.exp;

        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`,expTime);

        res.cookie("token",null,{expires : new Date(Date.now())});
        res.status(200).send("Logout successfully");
    } 
    catch (error) 
    {
        res.status(401).send(error.message);
    }
}

const adminRegister = async(req,res)=>{
    try 
    {
        authValidate(req.body);
        
        req.body.role = "admin";
        const {password , ...data} = req.body;
        const emailId = req.body.emailId;
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({password : hashedPassword ,...data});

        const token = jwt.sign({_id:newUser._id,emailId:emailId,role:newUser.role},process.env.JWT_SECRET,{expiresIn : 60*60});
        
        res.cookie("token",token,{maxAge : 60*60*1000});
        res.status(201).send("User created successfully!");
    } 
    catch (error) 
    {
        res.status(400).send(error.message);
    }
}

const deleteUser = async(req,res)=>{
    try
    {
        const id = req.userId;
        if(!id)
            return res.status(401).send("Invalid token");

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).send("Invalid user id");

        const userExist = await User.findById(id);
        if(!userExist)
            return res.status(404).send("user does not exist");

        await submission.deleteMany({userId : id});
        await User.findByIdAndDelete(id);

        return res.status(200).send("user deleted successfully");
    }
    catch(error)
    {
        res.status(500).send("Unexpected error occured :"+error.message);
    }
}

export {registerUser,logoutUser,loginUser,adminRegister,deleteUser};