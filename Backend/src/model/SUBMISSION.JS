import mongoose from "mongoose";
const {Schema} = mongoose;
import user from "./user.js";
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
            ref : "problem",
            required : true
        },
        code : {
            type : String,
            required : true
        },
        language : {
            type : String,
            required : true,
            enum : ["javascript","cpp","java","python"]
        },
        status : {
            type : String,
            enum : ["pending","accepted","compilation error","time limit exceeded"],
            default : "pending"
        },
        runtime : {
            type : Number,
            default : 0
        },
        memory : {
            type : Number,
            default : 0
        },
        errorMessage : {
            type : String,
            default : ""
        },
        testCasesPassed : {
            type : Number,
            default : 0
        },
        testCasesTotal : {
            type : Number,
            default : 0
        }
    },
    {
        timestamps : true
    }
)

submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ userId: 1, createdAt: -1 });

const submission = mongoose.model("submission",submissionSchema);

export default submission;