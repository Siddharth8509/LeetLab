import { getLanguageId, submitBatch, submitToken } from "../utils/problem.utils.js";
import mongoose from "mongoose";
import problem from "../model/problem.js";
import user from "../model/user.js";
import submission from "../model/submission.js"

const submitCode = async (req, res) => {
    try {
        const userId = req.userId;
        const problemId = req.params.id;
        const { code, language } = req.body;
        if (!userId || !problemId || !code || !language)
            return res.status(400).send("Please enter all valid fields");
        if (!mongoose.Types.ObjectId.isValid(problemId))
            return res.status(400).send("Invalid problem id format");

        const userInfo = await user.findById(userId);
        if (!userInfo)
            return res.status(401).send("Invalid user");

        const problemData = await problem.findById(problemId);
        if (!problemData)
            return res.status(404).send("Invalid problemId");

        const submitedProblem = await submission.create({
            userId: userId,
            problemId: problemId,
            code: code,
            language: language,
            status: "pending",
            testCasesTotal: problemData.hiddenTestCase.length
        });
        const languageId = getLanguageId(language);

        const judgeSubmissions = problemData.hiddenTestCase.map(({ input, output }) => ({
            source_code: code,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }))

        const submitResult = await submitBatch(judgeSubmissions);
        const resultToken = submitResult.map((value) => value.token)
        const testResults = await submitToken(resultToken);

        let runtime = 0;
        let memory = 0;
        let testCasesPassed = 0;
        let problemStatus = "accepted"
        let errorMessage = null;

        for (const test of testResults) {
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time) || 0;
                memory = Math.max(memory, test.memory || 0);
            }
            else {
                errorMessage = test.stderr || test.compile_output || "Execution error";
                problemStatus = test.status_id === 4 ? "wrong_answer" : "runtime_error";
                break;
            }
        }


        submitedProblem.memory = memory;
        submitedProblem.runtime = runtime;
        submitedProblem.testCasesPassed = testCasesPassed;
        submitedProblem.errorMessage = errorMessage;
        submitedProblem.status = problemStatus;

        if (!userInfo.problemSolved.includes(problemData._id)) {
            userInfo.problemSolved.push(problemData);
            await userInfo.save();
        }


        await submitedProblem.save();
        await submitedProblem.save();
        res.status(201).json({
            message: "Problem submitted successfully",
            submission: submitedProblem
        });
    }
    catch (error) {
        res.status(500).send("Internal server error" + error.message);
    }
}

const runCode = async (req, res) => {
    try {
        const userId = req.userId;
        const problemId = req.params.id;
        const { code, language } = req.body;
        if (!userId || !problemId || !code || !language)
            return res.status(400).send("Please enter all valid fields");
        if (!mongoose.Types.ObjectId.isValid(problemId))
            return res.status(400).send("Invalid problem id format");

        const userInfo = await user.findById(userId);
        if (!userInfo)
            return res.status(401).send("Invalid user");

        const problemData = await problem.findById(problemId);
        if (!problemData)
            return res.status(404).send("Invalid problemId");

        const languageId = getLanguageId(language);

        // USE VISIBLE TEST CASES FOR RUN
        const judgeSubmissions = problemData.visibleTestCase.map(({ input, output }) => ({
            source_code: code,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }))

        const submitResult = await submitBatch(judgeSubmissions);
        const resultToken = submitResult.map((value) => value.token)
        const testResults = await submitToken(resultToken);

        const detailedResults = testResults.map((test, index) => {
            const input = problemData.visibleTestCase[index].input;
            const expectedOutput = problemData.visibleTestCase[index].output;
            let status = "Pending";
            let actualOutput = "";
            let error = null;

            if (test.status_id === 3) {
                status = "Accepted";
                actualOutput = test.stdout;
            } else if (test.status_id === 4) {
                status = "Wrong Answer";
                actualOutput = test.stdout; // Judge0 usually returns stdout even for WA
                // If stdout is null, it might be empty
                if (actualOutput === null) actualOutput = "";
            } else {
                status = "Error"; // Runtime Error, Compilation Error, etc.
                error = test.stderr || test.compile_output || "Execution Error";
            }

            return {
                input,
                expectedOutput,
                actualOutput,
                status,
                error,
                statusId: test.status_id,
                time: test.time,
                memory: test.memory
            };
        });

        res.status(200).json(detailedResults);
    }
    catch (error) {
        res.status(500).send("Internal server error" + error.message);
    }
}

export { submitCode, runCode };