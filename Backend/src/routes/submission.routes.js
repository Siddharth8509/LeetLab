import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { submitCode, runCode } from "../controllers/submission.controller.js";

import { rateLimit } from "../middleware/rateLimit.js";

const submissionRouter = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many submissions, please try again after a minute"
});

submissionRouter.post("/submit/:id", authMiddleware, limiter, submitCode);
submissionRouter.post("/run/:id", authMiddleware, limiter, runCode);


export default submissionRouter;