import express from "express";
import adminMiddleware from "../middleware/admin.middleware.js";
const problemRouter = express.Router();
import {createProblem,getProblemById,problemFetchAll,updateProblem,solvedProblemByUser,deleteProblem,getSubmission} from "../controllers/problem.controller.js" 
import authMiddleware from "../middleware/auth.middleware.js";

//In this we just have to validate the admin
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


//In this we just have to validate the user
problemRouter.get("/user",authMiddleware,solvedProblemByUser);
problemRouter.get("/problemById/:id",authMiddleware,getProblemById);
problemRouter.get("/getAllProblems",authMiddleware,problemFetchAll);
problemRouter.get("/submission/:id",authMiddleware,getSubmission);

export default problemRouter;