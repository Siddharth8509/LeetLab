import mongoose from "mongoose";
const {Schema} = mongoose;

const problemSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        enum : ["easy","medium","hard"],
        required : true
    },
    tags : {
        type : String,
        enum : ["Array","HashTable","Linked-List","Stack","Queue","Tree","Graph","Trie","Binary seach"],
        required : true
    },
    companies :{
        type : String,
        required : true
    },
    discription : {
        type : String,
        required : true
    },
    examples : [{
        input : {
            type : String,
            required : true
        },
        output : {
            type : String,
            required : true
        },
        explanation : {
            type : String,
            required : true
        }
    }],
    visibleTestCase : [{
        input : {
            type : String,
            required : true
        },
        output : {
            type : String,
            required : true
        }
    }],
    hiddenTestCase : [{
        input : {
            type : String,
            required : true
        },
        output : {
            type : String,
            required : true
        }
    }],
    initialCode : [{
        language : {
            type : String,
            required : true,
            enum : ["JavaScript","C++","Java","Python"]
        },
        code : {
            type : String,
            required : true
        }
    }],
    problemCreator : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    referenceSolution : [{
        language :{
            type : String,
            required : true,
            enum : ["JavaScript","Java","C++","Python"]
        },
        solution : {
            type : String,
            required : true
        } 
    }]
})

const problem = mongoose.model("problem",problemSchema);

export default problem;