import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import user from "../model/user.js";

dotenv.config();

const authMiddleware = async(req,res,next)=>{
    try 
    {
        const token = req.cookies?.token;
        if(!token)
            res.status(401).send("Token doesn't exist")

        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            res.status(401).send("Session expired please login again")

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const userExists = await user.findById(decoded._id);
        if(!userExists)
            res.status(401).send("User doesn't exist");

        req.userId = decoded._id;
        req.result = userExists;

        next();
    } 
    catch (error) 
    {
        res.status(401).send("Invalid Token")
    }
}

export default authMiddleware;