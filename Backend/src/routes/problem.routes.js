import express from "express";
import adminMiddleware from "../middleware/admin.middleware.js";
const problemRouter = express.Router();
import createProblem from "../controllers/problem.controller.js" 

//In this we just have to validate the admin
problemRouter.post("/create",adminMiddleware,createProblem);


// problemRouter.get("/:id",adminMiddleware,getProblemById);
// problemRouter.get("/",adminMiddleware,problemFetchAll);

// //In this we just have to validate the user
// problemRouter.patch("/update/:id",updateProblem);
// problemRouter.delete("/delete/:id",deleteProblem);
// problemRouter.get("/user",solvedAllProblemByUser);

export default problemRouter;