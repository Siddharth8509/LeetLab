import {getLanguageId,submitBatch,submitToken} from "../utils/problem.utils.js";
import mongoose, { mongo } from "mongoose";
import problem from "../model/problem.js";
import user from "../model/user.js"

const createProblem = async(req,res)=>{
    const {
        title,difficulty,tags,companies,
        discription,examples,visibleTestCase,
        hiddenTestCase,initialCode,problemCreator,
        referenceSolution
        } = req.body;
        

    try 
    {
        for(const {language,solution} of referenceSolution)
        {
            const languageId = getLanguageId(language);

            const submission = visibleTestCase.map(({input,output})=>({
                source_code : solution,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }))

            const submitResult = await submitBatch(submission);
            const resultToken = submitResult.map((value)=>value.token)
            const testResults = await submitToken(resultToken);

            for (const test of testResults) {
                if (test.status_id === 3)
                    continue;

                if (test.status_id === 4)
                    return res.status(406).send("Wrong Answer");

                if (test.status_id === 5)
                    return res.status(406).send("Time Limit Exceeded");

                if (test.status_id === 6)
                    return res.status(406).send("Compilation Error");

                return res.status(406).send("Runtime Error");
                }
        }
        await problem.create({ ...req.body, problemCreator: req.userId });
        return res.status(201).send("Problem created successfully");    
    } 
    catch (error) {
        console.error("Error creating problem:", error);
        res.status(500).send("Internal server error");
    }
}

const getProblemById = async (req, res) => {
  try 
  {
    const { id } = req.params;
    if (!id) 
      return res.status(400).send("Problem id is required");
    

    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).send("Invalid problem id");
    

    const problemDoc = await problem.findById(id).select("title");

    if (!problemDoc)
      return res.status(404).send("Problem does not exist");
    

    return res.status(200).json({
      title: problemDoc.title
    });
  } 
  catch (error) 
  {
    return res.status(500).send(error.message);
  }
};

const problemFetchAll = async(req,res) => {
    try 
    {
        const titles = await problem.find().select("title");
        res.status(200).send(titles);
    } 
    catch (error) 
    {
        res.status(500).send("Error while fetching data")
    }
}

const updateProblem = async(req,res) => {
    try 
    {
        const data = req.body;
        if(!data)
            res.status(404).send("Please enter data to update");

        const {id} = req.params;
        if(!id)
            res.status(404).send("Please send the id of the problem")

        if(!mongoose.Types.ObjectId.isValid(id))
            res.status(404).send("Please enter a valid id")

        const updatedProblem = await problem.findByIdAndUpdate(id,data,{
            new : true,
            runValidators : true
        })

        res.status(200).send("Problem updated successfully : " + updatedProblem.title);
    } 
    catch (error) 
    {
        res.status(500).send("Error occured while updating"+error)
    }
}

const solvedProblemByUser = async(req,res) => {
    try 
    {
        const userId = req.userId;
        if (!userId) 
            return res.status(401).send("Unauthorized");

        if (!mongoose.Types.ObjectId.isValid(userId)) 
            return res.status(400).send("Invalid user id");
    

        const userData = await user.findById(userId).select("problemSolved");

        if (!userData) 
            return res.status(404).send("User not found");
    

        return res.status(200).json({solvedCount: userData.problemSolved.length,problems: userData.problemSolved});

    } 
    catch (error) 
    {
        return res.status(500).send("Failed to fetch data");
    }
}

const deleteProblem = async(req,res) => {
    try 
    {
        const {id} = req.params;
        if(!id)
            res.status(404).send("Please enter a valid id");
        
        if(!mongoose.Types.ObjectId.isValid(id))
            res.status(404).send("Invalid id")

        const deletedProblem = await problem.findByIdAndDelete(id);

        return res.status(200).send("Problem deleted successfully");
    } 
    catch (error) 
    {
        return res.status(500).send("An error occured while deleting the problem");     
    }
}

export  {createProblem,getProblemById,problemFetchAll,updateProblem,solvedProblemByUser,deleteProblem};