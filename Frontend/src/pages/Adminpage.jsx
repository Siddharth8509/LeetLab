import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm,useFieldArray } from "react-hook-form";
import axiosClient from "../utils/axiosClient";


const adminSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  companies: z
              .string()
              .transform((val)=>
                val.split(",").map(c => c.trim()).filter(Boolean)
              )
              .refine( arr => arr.length > 0 , "At least one company required"),
  description: z.string().trim().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
  "Array",
  "HashTable",
  "LinkedList",
  "Stack",
  "Queue",
  "Tree",
  "Graph",
  "Trie",
  "BinarySearch",
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
  ).length(4, "Reference solution is required"),

  initialCode: z.array(
    z.object({
      language: z.enum(["cpp", "java", "javascript", "python"]),
      code: z.string().trim().min(1, "Code is required"),
    })
  ).length(4, "Initial code is required"),
});

export default function Adminpage()
{
     const { register, handleSubmit, control ,formState: { errors }, } = useForm({ resolver: zodResolver(adminSchema),
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
    
    const { fields: exampleFields, append: addExample, remove: removeExample } = useFieldArray({ control, name: "examples"});
    const { fields: visibleTestCaseFields, append: addVisibleTestCase, remove: removeVisibleTestCase } = useFieldArray({ control, name: "visibleTestCase" });
    const { fields: hiddenTestCaseFields, append: addHiddenTestCase, remove: removeHiddenTestCase } = useFieldArray({ control, name: "hiddenTestCase" });


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
                      <option value="" disabled hidden>Select difficulty</option>
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
                            <option value="LinkedList">Linked-List</option>
                            <option value="Stack">Stack</option>
                            <option value="Queue">Queue</option>
                            <option value="Tree">Tree</option>
                            <option value="Graph">Graph</option>
                            <option value="Trie">Trie</option>
                            <option value="BinarySearch">Binary Search</option>
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
                      
                      <div className="flex flex-col gap-4">
                      {exampleFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col bg-gray-500 p-4 rounded-2xl gap-2">

                          <input {...register(`examples.${index}.input`)} placeholder="Input" className="bg-black p-2 rounded-xl"/>
                          <p className="text-red-400 text-sm"> {errors?.examples?.[index]?.input?.message} </p>

                          <input {...register(`examples.${index}.output`)} placeholder="Output" className="bg-black p-2 rounded-xl" />
                          <p className="text-red-400 text-sm"> {errors?.examples?.[index]?.output?.message} </p>

                          <textarea {...register(`examples.${index}.explanation`)} placeholder="Explanation" className="bg-black p-2 rounded-xl min-h-20"/>
                          <p className="text-red-400 text-sm"> {errors?.examples?.[index]?.explanation?.message} </p>

                          {exampleFields.length > 1 && (
                            <button type="button" onClick={() => removeExample(index)} className="text-red-300 self-end">
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button type="button" onClick={() => addExample({ input: "", output: "", explanation: "" })} className="btn w-fit">
                        + Add Example
                      </button>
                    </div>

                    </div>

                    {/* Visible Test Cases */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Visible Test Cases : </p>

                        <div className="flex flex-col gap-4">
                        
                        {visibleTestCaseFields.map((field,index) => (
                          <div key={field.id} className="flex flex-col bg-gray-500 p-4 rounded-2xl gap-2">
                            
                            <input placeholder="Input" {...register(`visibleTestCase.${index}.input`)} className="bg-black p-2 rounded-xl"></input>
                            <p className="text-red-400 text-sm"> {errors?.visibleTestCase?.[index]?.input?.message} </p>

                            <input placeholder="Output" {...register(`visibleTestCase.${index}.output`)} className="bg-black p-2 rounded-xl"></input>
                            <p className="text-red-400 text-sm"> {errors?.visibleTestCase?.[index]?.output?.message} </p>

                            {visibleTestCaseFields.length > 1 && (
                            <button type="button" onClick={() => removeVisibleTestCase(index)} className="text-red-300 self-end">
                              Remove
                            </button>
                          )}
                          </div>
                        ))}

                        <button className="btn" type="button" onClick={() => addVisibleTestCase({ input: "", output: "" })}>
                          + Add visible test case 
                        </button>

                        </div>

                    </div>

                    {/* Hidden Test Cases */}
                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Hidden Test Cases : </p>

                        <div className="flex flex-col gap-4">
                        
                        {hiddenTestCaseFields.map((field,index) => (
                          <div key={field.id} className="flex flex-col bg-gray-500 p-4 rounded-2xl gap-2">
                            
                            <input placeholder="Input" {...register(`hiddenTestCase.${index}.input`)} className="bg-black p-2 rounded-xl"></input>
                            <p className="text-red-400 text-sm"> {errors?.hiddenTestCase?.[index]?.input?.message} </p>

                            <input placeholder="Output" {...register(`hiddenTestCase.${index}.output`)} className="bg-black p-2 rounded-xl"></input>
                            <p className="text-red-400 text-sm"> {errors?.hiddenTestCase?.[index]?.output?.message} </p>

                            {hiddenTestCaseFields.length > 1 && (
                            <button type="button" onClick={() => removeHiddenTestCase(index)} className="text-red-300 self-end">
                              Remove
                            </button>
                          )}
                          </div>
                        ))}

                        <button className="btn" type="button" onClick={() => addHiddenTestCase({ input: "", output: "" })}>
                          + Add visible test case 
                        </button>

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