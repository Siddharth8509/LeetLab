import { TagIcon,BriefcaseIcon,ChevronLeftIcon,ChevronDownIcon } from "@heroicons/react/24/solid" 

export default function LeftPanel({prop})
{      
    const difficultyColor = {
        "easy": "bg-green-500",
        "medium": "bg-yellow-500",
        "hard": "bg-red-500"
    };

    const companies = prop?.companies[0].split(",") || [];
    

    return(
        <div className="px-2 py-1 bg-gray-800 h-full min-h-0 overflow-y-auto no-scrollbar scroll-smooth">
            
            {/* Title */}
            <div className="h-11 flex items-center gap-3 px-1">
                <button className="btn rounded-2xl btn-sm btn-soft bg-yellow-400 text-yellow-800 font-bold text-[15px]">Description</button>
                <button className="btn rounded-2xl btn-sm btn-soft bg-green-400 text-green-800 font-bold text-[15px]">Editorial</button>
                <button className="btn rounded-2xl btn-sm btn-soft bg-blue-400 text-blue-800 font-bold text-[15px]">Submissions</button>
                <button className="btn rounded-2xl btn-sm btn-soft bg-red-400 text-red-800 font-bold text-[15px]">Ask AI ⭐</button>
            </div>
            
            <hr className="border-dashed"></hr>
            
            {/* Property of problem */}
            <div className="flex flex-col gap-2">

            <div className="mt-1">
                <h1 className="font-bold text-3xl">{prop?.title} </h1>
            </div>

            <div className="flex gap-1">
                <button  className={`btn rounded-3xl font-bold text-black ${difficultyColor[prop?.difficulty]}`} >
                    {prop?.difficulty}
                </button>
                <button className="btn rounded-3xl">
                    <TagIcon className="w-4 h-4"/>
                    Topics
                </button>
                <button className="btn rounded-3xl">
                    <BriefcaseIcon className="w-4 h-4"/>
                    Companies
                </button>
            </div>

            </div>
            
            {/*Description */}
            <div className="pt-3 italic text-[16px] leading-4.5">
                <p className="whitespace-pre-line text-[16px]">{prop?.description}</p>
            </div>

            {/* Example */}
            <div className="flex flex-col gap-4 pt-5">
            {prop?.examples.map((e,index)=>{
                return(
                    <div key={index} className="bg-gray-800 border border-gray-600 rounded-xl hover:border-gray-500 transition">
                    <div className="px-4 py-3 flex flex-col gap-2 text-sm">
                        <p className="font-semibold text-yellow-400">Example {index + 1} </p>
                        
                        <p>
                        <span className="font-semibold text-green-400">Input:</span>{" "}
                        <span className="font-mono text-gray-200">{e.input}</span>
                        </p>

                        <p>
                        <span className="font-semibold text-blue-400">Output:</span>{" "}
                        <span className="font-mono text-gray-200">{e.output}</span>
                        </p>

                        <p>
                        <span className="font-semibold text-purple-400">Explanation:</span>{" "}
                        <span className="text-gray-300">{e.explanation}</span>
                        </p>
                    </div>
                </div>
                )
            })}
            </div>
            
            {/*Drop-Down*/}
            <div className="mt-10 flex flex-col gap-2">

                <details className="group collapse">
                    <summary className="collapse-title font-semibold flex items-center justify-between cursor-pointer">
                    Topics
                    <ChevronDownIcon className="w-5 h-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="collapse-content">
                    <button className="btn btn-disabled font-bold text-black rounded-3xl btn-sm bg-blend-difference bg-gray-400 p-3">{prop?.tags}</button>
                    </div>
                </details>
            <hr className="border-dashed" />
                <details className="group collapse">
                    <summary className="collapse-title font-semibold flex items-center justify-between cursor-pointer">
                    Companies
                    <ChevronDownIcon className="w-5 h-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="collapse-content">
                        {companies.map((company, index) => (
                            <button key={index} className="btn btn-disabled font-bold text-black rounded-3xl btn-sm bg-blend-difference bg-gray-400 p-3 mr-2 mb-2">{company}</button>
                        ))}
                    </div>
                </details>
            
            </div>

        </div>
    )
}