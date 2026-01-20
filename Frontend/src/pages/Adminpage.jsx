import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


export default function Adminpage()
{
    const { register, handleSubmit} = useForm();

    return(
        
        <div className="min-h-screen flex flex-col">

            <div className="bg-amber-600 container mx-auto w-[80vw] mt-10 h-[80vh] rounded-4xl">
                
                <form className="flex flex-col">
                <div className="p-10">

                    <div className="flex gap-2 items-center">
                        <p className="text-xl font-bold">Title : </p>
                        <input type="text" {...register("title")} className="bg-black p-2 rounded-xl"></input>
                    </div>
                     
                    <div className="flex gap-2 items-center mt-5">
                        <p className="text-xl font-bold">Difficulty : </p>
                        <select className="select w-60 rounded-2xl" {...register("difficulty")}>
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                        </select>
                    </div>

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
                            <option value="Binary seach">Binary seach</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-2 items-center mt-5">
                        <p className="text-xl font-bold">Companies : </p>
                        <input type="text" {...register("companies")} className="bg-black p-2 rounded-xl"></input>
                    </div>

                    <div className="flex gap-2  mt-5">
                        <p className="text-xl font-bold">Description : </p>
                        <textarea {...register("description")} className="bg-black p-2 rounded-xl w-70"></textarea>
                    </div>

                </div>
                </form>
                
            </div>

        </div>

    )
}