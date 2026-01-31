import { useState,useEffect,useRef } from "react";
import axiosClient from "../utils/axiosClient";
import Editor from '@monaco-editor/react';
import { useParams } from "react-router-dom";
import Timer from "../components/Timer";
import { Panel, Group , Separator } from "react-resizable-panels";
import LeftPanel from "../components/LeftPanel";
import UpperRightPanle from "../components/UpperRightPanle";
import BottomRight from "../components/BottomRight";

export default function Problempage()
{
    let {id} = useParams();

    const [problemData,setProblemData] = useState(null);
    const[code,setCode] = useState("");

    //for fetching problem data
    useEffect(()=>{
    const fetchProblemData = async() =>{
        try 
        {
            const res = await axiosClient.get(`/problem/problemById/${id}`)
            setProblemData(res.data);
        } 
        catch (error) 
        {
            console.log("Error occured while fetching the data " + error.message);
        }
    }
    fetchProblemData();
    },[id])
    
    return (
    <>
    <div className="h-screen w-screen">
        
        {/*NavBar*/}
        <div className="flex h-15 bg-amber-600 items-center justify-between px-4">
            {/* Right */}
            <div className="flex gap-3">

            <div className="btn btn-neutral w-37 flex justify-between items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                </svg>
                <div >Problem-List</div>
            </div>

            <div className="flex gap-0.5">
                <button className="btn w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-6 scale-[3]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                </button>
                <button className="btn w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-6 scale-[3]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                </button>
            </div>

            </div>
            
            {/*Middle */}
            <div className="flex gap-3 mr-11">

            <div>
                <button className="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:stroke-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>

                </button>
            </div>

            <div>
                <button className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
                Submit
                </button>
            </div>

            </div>

            {/*Left */}
            <div>
                <Timer></Timer>
            </div>
        </div>

        
        <div className="bg-blue-950 h-[calc(100vh-60px)]">
            <Group orientation="horizontal">

                <Panel>
                    {problemData && ( 
                        <LeftPanel prop={{ problemData }} />
                    )}
                </Panel>
                <Separator className="w-1 bg-gray-400 cursor-col-resize" />
                <Panel>
                    {problemData && (
                    <Group orientation="vertical">
                        <Panel className="bg-blue-600 overflow-auto">
                        <UpperRightPanle prop={problemData} onCodeChange={setCode}/>
                        </Panel>
                        <Separator className="h-1 bg-gray-400 cursor-row-resize" />
                        <Panel defaultSize="30%" className="bg-red-400">
                        <BottomRight prop={problemData} />
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