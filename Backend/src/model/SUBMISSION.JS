import mongoose from "mongoose";
const {Schema} = mongoose;
import User from "./user.js";
import problem from "./problem.js";

const submissionSchema = new Schema(
    {
        userId : {
            type : Schema.Types.ObjectId,
            ref : "user",
            required : true
        },
        problemId : {
            type : Schema.Types.ObjectId,
            ref :
        }
    }
)