import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dbConnection from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import redisClient from "./config/redis.js";
import problemRouter from "./routes/problem.routes.js";
import submissionRouter from "./routes/submission.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const port = process.env.PORT || 3000
async function connection()
{
    await redisClient.connect();
    console.log("Redis client is connected");

    await dbConnection();
    console.log("Connected to database");

    app.listen(port ,()=>{
        console.log(`Server is running on port no. ${port}`);
    })
}

connection();

app.use("/user",authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submissionRouter);