import {getLanguageId,submitBatch,submitToken} from "../utils/problem.utils.js";
import mongoose from "mongoose";
import problem from "../model/problem.js";

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

export default createProblem;