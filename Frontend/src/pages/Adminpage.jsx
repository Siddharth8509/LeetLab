import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const adminSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  companies: z
    .string()
    .transform((val) =>
      val.split(",").map(c => c.trim()).filter(Boolean)
    )
    .refine(arr => arr.length > 0, "At least one company required"),
  description: z.string().trim().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum([
    "Array", "HashTable", "LinkedList", "Stack", "Queue", "Tree", "Graph", "Trie", "BinarySearch",
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

const InputGroup = ({ label, error, children }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-gray-400 font-medium text-sm ml-1">{label}</label>
    {children}
    {error && <span className="text-red-400 text-xs ml-1">{error}</span>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e1e1e] border border-gray-700 rounded-2xl p-6 shadow-xl"
  >
    <h2 className="text-xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">{title}</h2>
    {children}
  </motion.div>
);

export default function Adminpage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      difficulty: "easy",
      tags: "Array",
      examples: [{ input: "", output: "", explanation: "" }],
      visibleTestCase: [{ input: "", output: "" }],
      hiddenTestCase: [{ input: "", output: "" }],
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
    mode: "onChange"
  });

  const { fields: exampleFields, append: addExample, remove: removeExample } = useFieldArray({ control, name: "examples" });
  const { fields: visibleTestCaseFields, append: addVisibleTestCase, remove: removeVisibleTestCase } = useFieldArray({ control, name: "visibleTestCase" });
  const { fields: hiddenTestCaseFields, append: addHiddenTestCase, remove: removeHiddenTestCase } = useFieldArray({ control, name: "hiddenTestCase" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post("/problem/create", data);
      console.log("Problem created:", res.data);
      alert("Problem created successfully!");
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert("Failed to create problem: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "bg-[#262626] border border-gray-600 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-600";
  const btnClass = "btn btn-sm bg-amber-600 hover:bg-amber-500 text-black font-bold border-none rounded-lg mt-2 w-fit";
  const removeBtnClass = "p-2 text-red-400 hover:bg-red-900/30 rounded-full transition-colors self-start mt-8";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            <span className="text-amber-500">Create</span> New Problem
          </h1>
          <div className="bg-amber-500/10 px-4 py-2 rounded-full text-amber-500 text-sm font-mono border border-amber-500/20">
            Admin Panel
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* General Info */}
          <SectionCard title="General Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputGroup label="Problem Title" error={errors.title?.message}>
                  <input {...register("title")} className={inputClass} placeholder="e.g. Two Sum" />
                </InputGroup>
              </div>

              <InputGroup label="Difficulty" error={errors.difficulty?.message}>
                <select {...register("difficulty")} className={inputClass}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </InputGroup>

              <InputGroup label="Topic Tag" error={errors.tags?.message}>
                <select {...register("tags")} className={inputClass}>
                  {[
                    "Array", "HashTable", "LinkedList", "Stack", "Queue",
                    "Tree", "Graph", "Trie", "BinarySearch"
                  ].map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </InputGroup>

              <div className="md:col-span-2">
                <InputGroup label="Companies (comma separated)" error={errors.companies?.message}>
                  <input {...register("companies")} className={inputClass} placeholder="e.g. Google, Amazon, Meta" />
                </InputGroup>
              </div>

              <div className="md:col-span-2">
                <InputGroup label="Problem Description" error={errors.description?.message}>
                  <textarea {...register("description")} className={`${inputClass} min-h-[150px] font-mono text-sm`} placeholder="Markdown supported..." />
                </InputGroup>
              </div>
            </div>
          </SectionCard>

          {/* Examples */}
          <SectionCard title="Examples">
            <div className="space-y-6">
              <AnimatePresence>
                {exampleFields.map((field, index) => (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    key={field.id}
                    className="bg-[#262626] border border-gray-700 p-4 rounded-xl flex gap-4"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup label={`Example ${index + 1} Input`} error={errors.examples?.[index]?.input?.message}>
                        <input {...register(`examples.${index}.input`)} className={inputClass} placeholder='x = 123' />
                      </InputGroup>
                      <InputGroup label={`Example ${index + 1} Output`} error={errors.examples?.[index]?.output?.message}>
                        <input {...register(`examples.${index}.output`)} className={inputClass} placeholder='321' />
                      </InputGroup>
                      <div className="md:col-span-2">
                        <InputGroup label="Explanation" error={errors.examples?.[index]?.explanation?.message}>
                          <textarea {...register(`examples.${index}.explanation`)} className={`${inputClass} min-h-[80px]`} placeholder="Explain why..." />
                        </InputGroup>
                      </div>
                    </div>
                    {exampleFields.length > 1 && (
                      <button type="button" onClick={() => removeExample(index)} className={removeBtnClass}>
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={() => addExample({ input: "", output: "", explanation: "" })} className={btnClass}>
                <div className="flex items-center gap-1">
                  <PlusIcon className="w-4 h-4" /> Add Example
                </div>
              </button>
            </div>
          </SectionCard>

          {/* Valid Test Cases */}
          <SectionCard title="Visible Test Cases">
            <div className="space-y-4">
              {visibleTestCaseFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-4 bg-[#262626] p-3 rounded-xl border border-gray-700">
                    <InputGroup label="Input" error={errors.visibleTestCase?.[index]?.input?.message}>
                      <input {...register(`visibleTestCase.${index}.input`)} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Output" error={errors.visibleTestCase?.[index]?.output?.message}>
                      <input {...register(`visibleTestCase.${index}.output`)} className={inputClass} />
                    </InputGroup>
                  </div>
                  {visibleTestCaseFields.length > 1 && (
                    <button type="button" onClick={() => removeVisibleTestCase(index)} className="mt-8 text-red-500 hover:text-red-400">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addVisibleTestCase({ input: "", output: "" })} className={btnClass}>
                <div className="flex items-center gap-1">
                  <PlusIcon className="w-4 h-4" /> Add Test Case
                </div>
              </button>
            </div>
          </SectionCard>

          {/* Hidden Test Cases */}
          <SectionCard title="Hidden Test Cases">
            <div className="space-y-4">
              {hiddenTestCaseFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-4 bg-[#262626] p-3 rounded-xl border border-gray-700">
                    <InputGroup label="Input" error={errors.hiddenTestCase?.[index]?.input?.message}>
                      <input {...register(`hiddenTestCase.${index}.input`)} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Output" error={errors.hiddenTestCase?.[index]?.output?.message}>
                      <input {...register(`hiddenTestCase.${index}.output`)} className={inputClass} />
                    </InputGroup>
                  </div>
                  {hiddenTestCaseFields.length > 1 && (
                    <button type="button" onClick={() => removeHiddenTestCase(index)} className="mt-8 text-red-500 hover:text-red-400">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addHiddenTestCase({ input: "", output: "" })} className={btnClass}>
                <div className="flex items-center gap-1">
                  <PlusIcon className="w-4 h-4" /> Add Hidden Case
                </div>
              </button>
            </div>
          </SectionCard>

          {/* Code Configuration */}
          <SectionCard title="Language Specifics">
            <div className="space-y-8">
              {/* Reference Solutions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-4">Reference Solutions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {["cpp", "java", "javascript", "python"].map((lang, idx) => (
                    <div key={lang} className="bg-[#262626] p-4 rounded-xl border border-gray-700">
                      <input type="hidden" value={lang} {...register(`referenceSolution.${idx}.language`)} />
                      <InputGroup label={`${lang.toUpperCase()} Solution`} error={errors.referenceSolution?.[idx]?.solution?.message}>
                        <textarea {...register(`referenceSolution.${idx}.solution`)} className={`${inputClass} font-mono text-xs min-h-[150px]`} placeholder={`Paste ${lang} solution here...`} />
                      </InputGroup>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Codes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-400 mb-4">Starter Code</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {["cpp", "java", "javascript", "python"].map((lang, idx) => (
                    <div key={lang} className="bg-[#262626] p-4 rounded-xl border border-gray-700">
                      <input type="hidden" value={lang} {...register(`initialCode.${idx}.language`)} />
                      <InputGroup label={`${lang.toUpperCase()} Starter`} error={errors.initialCode?.[idx]?.code?.message}>
                        <textarea {...register(`initialCode.${idx}.code`)} className={`${inputClass} font-mono text-xs min-h-[150px]`} placeholder={`Paste ${lang} boilerplate here...`} />
                      </InputGroup>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end pt-10 pb-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black border-none font-bold px-10 rounded-2xl shadow-lg shadow-amber-900/20 ${isSubmitting ? 'loading' : ''}`}
            >
              {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
            </motion.button>
          </div>

        </form>
      </div>
    </div>
  );
}