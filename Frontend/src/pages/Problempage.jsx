import { useState, useEffect, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import Editor from '@monaco-editor/react';
import { useParams } from "react-router-dom";
import Timer from "../components/Timer";
import { Panel, Group, Separator } from "react-resizable-panels";
import LeftPanel from "../components/LeftPanel";
import UpperRightPanle from "../components/UpperRightPanle";
import BottomRight from "../components/BottomRight";
import { languages } from "monaco-editor";

import { motion } from "motion/react";

export default function Problempage() {
    let { id } = useParams();

    const [problemData, setProblemData] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");

    const [runResult, setRunResult] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Cooldown timer
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    //for fetching problem data
    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const res = await axiosClient.get(`/problem/problemById/${id}`)
                setProblemData(res.data);
            }
            catch (error) {
                console.log("Error occured while fetching the data " + error.message);
            }
        }
        fetchProblemData();
    }, [id])

    const runCodehandler = async () => {
        if (isProcessing || cooldown > 0) return;
        setIsProcessing(true);
        setCooldown(5); // Start 5s cooldown
        try {
            const res = await axiosClient.post(`/submission/run/${id}`, { language: language, code: code });
            console.log("Run code response: ", res.data);
            setRunResult(res.data);
        }
        catch (error) {
            console.log("Error while running code: " + error.message);
            if (error.response?.status === 429) {
                alert("Too many requests! Please wait.");
            }
        }
        finally {
            setIsProcessing(false);
        }
    }

    const submitCodehandler = async () => {
        if (isProcessing || cooldown > 0) return;
        setIsProcessing(true);
        setCooldown(5); // Start 5s cooldown
        try {
            const res = await axiosClient.post(`/submission/submit/${id}`, { language: language, code: code });
            console.log("Submit code response: ", res.data);
            setSubmissionResult(res.data.submission);
        }
        catch (error) {
            console.log("Error while submitting code: " + error.message);
            if (error.response?.status === 429) {
                alert("Too many requests! Please wait.");
            }
        }
        finally {
            setIsProcessing(false);
        }
    }

    return (
        <>
            <div className="h-screen w-screen bg-[#1a1a1a] text-gray-300">

                {/*NavBar*/}
                <div className="flex h-15 bg-[#262626] border-b border-gray-700 items-center justify-between px-4">
                    {/* Right */}
                    <div className="flex gap-3">

                        <div className="btn btn-neutral w-37 flex justify-between items-center bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                            </svg>
                            <div>Problem-List</div>
                        </div>

                        <div className="flex gap-0.5">
                            <button className="btn w-10 h-10 bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-6 scale-[3]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button className="btn w-10 h-10 bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-6 scale-[3]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>

                    </div>

                    {/*Middle */}
                    <div className="flex gap-3 mr-11">

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn bg-gray-700 hover:bg-gray-600 border-none text-gray-200 gap-2 ${isProcessing || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={runCodehandler}
                            disabled={isProcessing || cooldown > 0}
                        >
                            {isProcessing ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:stroke-amber-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>
                            )}
                            {cooldown > 0 ? `Wait ${cooldown}s` : "Run"}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn text-green-500 hover:text-green-400 border-none bg-transparent hover:bg-gray-800 gap-2 ${isProcessing || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={submitCodehandler}
                            disabled={isProcessing || cooldown > 0}
                        >
                            {isProcessing ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                </svg>
                            )}
                            {cooldown > 0 ? `Wait ${cooldown}s` : "Submit"}
                        </motion.button>

                    </div>

                    {/*Left */}
                    <div>
                        <Timer></Timer>
                    </div>
                </div>


                <div className="h-[calc(100vh-56px)]">
                    <Group orientation="horizontal">

                        <Panel defaultSize="50%" minSize={20}>
                            {problemData && (
                                <LeftPanel prop={{ problemData, submissionResult }} />
                            )}
                        </Panel>

                        <Separator className="w-1 bg-[#1a1a1a] cursor-col-resize hover:bg-amber-500 transition-colors" />

                        <Panel>
                            {problemData && (
                                <Group orientation="vertical">
                                    <Panel className="bg-[#1e1e1e] overflow-hidden" defaultSize={60} minSize={30}>
                                        <UpperRightPanle prop={problemData} onCodeChange={setCode} />
                                    </Panel>

                                    <Separator className="h-1 bg-[#1a1a1a] cursor-row-resize hover:bg-amber-500 transition-colors" />

                                    <Panel defaultSize={40} minSize={20} className="bg-[#1e1e1e]">
                                        <BottomRight prop={problemData} runResult={runResult} />
                                    </Panel>
                                </Group>
                            )}
                        </Panel>

                    </Group>
                </div>

            </div>
        </>
    );
}