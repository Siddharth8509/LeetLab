import mongoose from "mongoose";
const { Schema } = mongoose;
import problem from "./problem.js";

const userSchema = new Schema(
    {
    firstname : {
        type : String,
        minlength : 2,
        maxlength : 10,
        required : true,
        trim : true
    },
    lastname : {
        type : String,
        minlength : 2,
        maxlength : 10,
        trim : true
    },
    age : {
        type : Number,
        min : 6,
        max : 60,
    },
    emailId : {
        type : String,
        required : true,
        immutable : true,
        trim : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 8
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    },
    gender : {
        type : String,
        enum : ["male","female","others"],
    },
    problemSolved : {
        type : [{
            type : Schema.Types.ObjectId,
            ref : "problem"
        }],
        default : []
    }
    },
    {
        timestamps : true
    }
)

const user = mongoose.model("user",userSchema);

export default user;