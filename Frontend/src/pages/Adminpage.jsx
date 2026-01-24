import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";

const adminSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  companies: z.string().trim().min(1),
  description: z.string().trim().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
  "Array",
  "HashTable",
  "Linked-List",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "Trie",
  "Binary Search",
  ]),

  examples: z.array(
    z.object({
      input: z.string().trim().min(1, "Input is required"),
      output: z.string().trim().min(1, "Output is required"),
      explanation: z.string().trim().min(1, "Explanation is required"),
    })
  ).min(1, "At least one example is required"),

  visibleTestCase: z.array(
    z.object({
      input: z.string().trim().min(1, "Input is required"),
      output: z.string().trim().min(1, "Output is required"),
    })
  ).min(1, "At least one visible test case is required"),

  hiddenTestCase: z.array(
    z.object({
      input: z.string().trim().min(1, "Input is required"),
      output: z.string().trim().min(1, "Output is required"),
    })
  ).min(1, "At least one hidden test case is required"),

  referenceSolution: z.array(
    z.object({
      language: z.enum(["cpp", "java", "javascript", "python"]),
      solution: z.string().trim().min(1, "Solution is required"),
    })
  ).min(1, "Reference solution is required"),

  initialCode: z.array(
    z.object({
      language: z.enum(["cpp", "java", "javascript", "python"]),
      code: z.string().trim().min(1, "Code is required"),
    })
  ).min(1, "Initial code is required"),
});

export default function Adminpage()
{
     const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(adminSchema),
    defaultValues: {
      examples: [
        { input: "", output: "", explanation: "" },
        { input: "", output: "", explanation: "" },
      ],
      visibleTestCase: [
        { input: "", output: "" },
        { input: "", output: "" },
      ],
      hiddenTestCase: [
        { input: "", output: "" },
        { input: "", output: "" },
      ],
      referenceSolution: [
        { language: "cpp", solution: "" },
        { language: "java", solution: "" },
        { language: "javascript", solution: "" },
        { language: "python", solution: "" },
      ],
      initialCode: [
        { language: "cpp", code: "" },
        { language: "java", code: "" },
        { language: "javascript", code: "" },
        { language: "python", code: "" },
      ],
    },
  });
    
    const onSubmit = async (data) => {
    try {
      const res = await axiosClient.post("/problem/create", data);
      console.log("Problem created:", res.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };
  
    return(
        
        <div className="min-h-screen flex flex-col">

            <div className="bg-amber-600 container mx-auto w-[80vw] mt-10 min-h-[80vh] rounded-4xl">
                
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <div className="p-10">
                    
                    {/* Title */}
                    <div className="flex gap-2 items-center">
                        <p className="text-xl font-bold">Title :</p>
                        <input {...register("title")} className="bg-black p-2 rounded-xl" />
                        <p className="text-red-400 text-sm">{errors.title?.message}</p>
                    </div>
                     
                     {/* Difficulty */}
                    <div className="flex gap-2 items-center mt-5">
                    <p className="text-xl font-bold">Difficulty :</p>
                    <select {...register("difficulty")} className="select w-60 rounded-2xl">
                        <option value="">Select</option>
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </select>
                    <p className="text-red-400 text-sm">{errors.difficulty?.message}</p>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2 items-center mt-5">
                    <p className="text-xl font-bold">Tags : </p>
                    <select className="select w-60 rounded-2xl" {...register("tags")}>
                            <option value="Array">Array</option>
                            <option value="HashTable">HashTable</option>
                            <option value="Linked-List">Linked-List</option>
                            <option value="Stack">Stack</option>
                            <option value="Queue">Queue</option>
                            <option value="Tree">Tree</option>
                            <option value="Graph">Graph</option>
                            <option value="Trie">Trie</option>
                            <option value="Binary Search">Binary Search</option>
                        </select>
                        <p className="text-red-400 text-sm">{errors.tags?.message}</p>
                    </div>
                    
                    {/* Companies */}
                    <div className="flex gap-2 items-center mt-5">
                        <p className="text-xl font-bold">Companies : </p>
                        <input type="text" {...register("companies")} className="bg-black p-2 rounded-xl"></input>
                        <p className="text-red-400 text-sm">{errors.companies?.message}</p>
                    </div>

                    {/* Description */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Description : </p>
                        <textarea {...register("description")} className="bg-black p-2 rounded-xl w-70 min-h-40"></textarea>
                        <p className="text-red-400 text-sm">{errors.description?.message}</p>
                    </div>
                    
                    {/* Example */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Example : </p>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("examples.0.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm"> {errors?.examples?.[0]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("examples.0.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.examples?.[0]?.output?.message}</p>
                            </div>
                            
                            <div className="flex gap-2">
                            <p>Explanation : </p>
                            <textarea type="text" {...register("examples.0.explanation")} className="bg-black p-2 rounded-xl min-h-20"></textarea>
                            <p className="text-red-400 text-sm">{errors?.examples?.[0]?.explanation?.message}</p>
                            </div>

                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("examples.1.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.examples?.[1]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("examples.1.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.examples?.[1]?.output?.message}</p>
                            </div>
                            
                            <div className="flex gap-2">
                            <p>Explanation : </p>
                            <textarea type="text" {...register("examples.1.explanation")} className="bg-black p-2 rounded-xl min-h-20"></textarea>
                            <p className="text-red-400 text-sm">{errors?.examples?.[1]?.explanation?.message}</p>
                            </div>

                        </div>

                    </div>
                    
                    {/* Visible Test Cases */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Visible Test Cases : </p>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("visibleTestCase.0.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.visibleTestCase?.[0]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("visibleTestCase.0.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.visibleTestCase?.[0]?.output?.message}</p>
                            </div>

                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("visibleTestCase.1.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.visibleTestCase?.[1]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("visibleTestCase.1.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.visibleTestCase?.[1]?.output?.message}</p>
                            </div>

                        </div>

                    </div>

                    {/* Hidden Test Cases */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Hidden Test Cases : </p>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("hiddenTestCase.0.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.hiddenTestCase?.[0]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("hiddenTestCase.0.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.hiddenTestCase?.[0]?.output?.message}</p>
                            </div>

                        </div>

                         <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                        
                            <div className="flex gap-2  items-center">
                            <p className="w-20">Input : </p>
                            <input type="text" {...register("hiddenTestCase.1.input")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.hiddenTestCase?.[1]?.input?.message}</p>
                            </div>

                            <div className="flex gap-2  items-center">
                            <p className="w-20">Output : </p>
                            <input type="text" {...register("hiddenTestCase.1.output")} className="bg-black p-2 rounded-xl w-full"></input>
                            <p className="text-red-400 text-sm">{errors?.hiddenTestCase?.[1]?.output?.message}</p>
                            </div>

                        </div>

                    </div>

                    {/* Reference Solution */}
                    <div>

                    <p className="text-xl font-bold mt-5">Reference Solution : </p>
                    
                    <div className="mt-5 grid grid-flow-col-dense grid-rows-2 gap-8 max-w-fit">

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="cpp" {...register("referenceSolution.0.language")} />
                            <p className="font-bold">C++</p>
                            <div className="flex flex-col gap-2">
                            <p>Reference Solution : </p>
                            <textarea type="text" {...register("referenceSolution.0.solution")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            <p className="text-red-400 text-sm">{errors?.referenceSolution?.[0]?.solution?.message}</p>
                            </div>

                        </div>

                       <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="java" {...register("referenceSolution.1.language")} />
                            <p className="font-bold">Java</p>
                            <div className="flex flex-col gap-2">
                            <p>Reference Solution : </p>
                            <textarea type="text" {...register("referenceSolution.1.solution")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            <p className="text-red-400 text-sm">{errors?.referenceSolution?.[1]?.solution?.message}</p>
                            </div>
                            
                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="javascript" {...register("referenceSolution.2.language")} />
                            <p className="font-bold">JavaScript</p>
                            <div className="flex flex-col gap-2">
                            <p>Reference Solution : </p>
                            <textarea type="text" {...register("referenceSolution.2.solution")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            <p className="text-red-400 text-sm">{errors?.referenceSolution?.[2]?.solution?.message}</p>
                            </div>
                            
                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="python" {...register("referenceSolution.3.language")} />
                            <p className="font-bold">Python</p>
                            <div className="flex flex-col gap-2">
                            <p>Reference Solution : </p>
                            <textarea type="text" {...register("referenceSolution.3.solution")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            <p className="text-red-400 text-sm">{errors?.referenceSolution?.[3]?.solution?.message}</p>
                            </div>
                            
                        </div>

                    </div>

                    </div>

                    {/* Initial Codes */}
                    <div>

                    <p className="text-xl font-bold mt-5">Initial Codes : </p>
                    
                    <div className="mt-5 grid grid-flow-col-dense grid-rows-2 gap-8 max-w-fit">

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="cpp" {...register("initialCode.0.language")} />
                            <p className="font-bold">C++</p>
                            <div className="flex flex-col gap-2">
                            <p>Initial Code : </p>
                            <textarea type="text" {...register("initialCode.0.code")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            <p className="text-red-400 text-sm">{errors?.initialCode?.[0]?.code?.message}</p>
                            </div>

                        </div>

                       <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">
                            
                            <input type="hidden" value="java" {...register("initialCode.1.language")} />
                            <p className="font-bold">Java</p>
                            <div className="flex flex-col gap-2">
                            <p>Initial Code : </p>
                            <textarea type="text" {...register("initialCode.1.code")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            </div>
                            
                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">

                            <input type="hidden" value="javascript" {...register("initialCode.2.language")} />
                            <p className="font-bold">JavaScript</p>
                            <div className="flex flex-col gap-2">
                            <p>Initial Code : </p>
                            <textarea type="text" {...register("initialCode.2.code")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            </div>
                            
                        </div>

                        <div className="flex flex-col bg-gray-500  p-4 rounded-2xl gap-4">

                            <input type="hidden" value="python" {...register("initialCode.3.language")} />
                            <p className="font-bold">Python</p>
                            <div className="flex flex-col gap-2">
                            <p>Initial Code : </p>
                            <textarea type="text" {...register("initialCode.3.code")} className="bg-black p-2 rounded-xl min-h-40 min-w-60"></textarea>
                            </div>
                            
                        </div>

                    </div>

                    </div>

                    <div className="flex justify-center mt-10">
                    <button type="submit" className="btn">Submit</button>
                    </div>

                </div>
                </form>
                
            </div>

        </div>

    )
}