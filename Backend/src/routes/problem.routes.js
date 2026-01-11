import express from "express";
import adminMiddleware from "../middleware/admin.middleware.js";
const problemRouter = express.Router();
import {createProblem,getProblemById,problemFetchAll,updateProblem,solvedProblemByUser,deleteProblem} from "../controllers/problem.controller.js" 
import authMiddleware from "../middleware/auth.middleware.js";

//In this we just have to validate the admin
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.get("/:id",adminMiddleware,getProblemById);
problemRouter.get("/",adminMiddleware,problemFetchAll);
problemRouter.patch("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


//In this we just have to validate the user
problemRouter.get("/user",authMiddleware,solvedProblemByUser);

export default problemRouter;