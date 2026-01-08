import mongoose from "mongoose";
const { Schema } = mongoose;

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
        required : true
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
        required : true
    },
    problemSolved : {
        type : [String],
        default : []
    }
    },
    {
        timestamps : true
    }
)

const User = mongoose.model("User",userSchema);

export default User;