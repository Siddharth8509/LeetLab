import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {submitCode,runCode} from "../controllers/submission.controller.js";

const submissionRouter = express.Router();

submissionRouter.post("/submit/:id",authMiddleware,submitCode);
submissionRouter.post("/run/:id",authMiddleware,runCode);


export default submissionRouter;