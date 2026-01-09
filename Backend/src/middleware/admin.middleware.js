import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminMiddleware = async(req,res,next)=>{
    try 
    {
        const token = req.cookies?.token;
        if(!token)
            res.status(401).send("Token doesn't exist")

        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            res.status(401).send("Session expired please login again")

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decoded._id;

        if(decoded.role!="admin")
            throw new Error("Invalid token")

        next();
    } 
    catch (error) 
    {
        res.status(401).send("Invalid Token")
    }
}

export default adminMiddleware;