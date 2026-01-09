import express from "express";

const problemRouter = express.Router();

//In this we just have to validate the admin
problemRouter.post("/create",createProblem);
problemRouter.get("/:id",problemFetch);
problemRouter.get("/",problemFetchAll);

//In this we just have to validate the user
problemRouter.patch("/update/:id",problemUpdate);
problemRouter.delete("/delete/:id",pproblemDelete);
problemRouter.get("/user",solvedProblem);

export default problemRouter;