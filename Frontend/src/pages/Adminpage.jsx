import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon, UserGroupIcon, DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

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
  const [activeTab, setActiveTab] = useState("create");
  const [editingProblemId, setEditingProblemId] = useState(null);

  // Create/Edit Form Logic
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
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

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingProblemId) {
        await axiosClient.put(`/problem/update/${editingProblemId}`, data);
        alert("Problem updated successfully!");
      } else {
        await axiosClient.post("/problem/create", data);
        alert("Problem created successfully!");
        reset();
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert("Failed to save problem: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manage Problems Logic
  const [problems, setProblems] = useState([]);
  const fetchProblems = async () => {
    try {
      const res = await axiosClient.get("/problem/getAllProblems?page=1"); // Ideally pagination
      setProblems(res.data.problems);
    } catch (error) {
      console.error("Failed to fetch problems", error);
    }
  };

  const deleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(p => p._id !== id));
    } catch (error) {
      alert("Failed to delete problem");
    }
  };

  const editProblem = async (id) => {
    try {
      const res = await axiosClient.get(`/problem/problemById/${id}`);
      const data = res.data;
      // Transform companies array back to string
      if (Array.isArray(data.companies)) data.companies = data.companies.join(", ");

      reset(data);
      setEditingProblemId(id);
      setActiveTab("create");
    } catch (error) {
      console.error("Failed to fetch problem details", error);
    }
  }

  // Manage Users Logic
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/auth/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosClient.delete(`/auth/delete/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  // Switch to Create Tab resets edit mode if clicked directly
  const switchToCreate = () => {
    setEditingProblemId(null);
    reset({
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
      title: "",
      companies: "",
      description: "" // Ensure these are cleared
    });
    setActiveTab("create");
  }


  useEffect(() => {
    if (activeTab === "problems") fetchProblems();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const inputClass = "bg-[#262626] border border-gray-600 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-600";
  const btnClass = "btn btn-sm bg-amber-600 hover:bg-amber-500 text-black font-bold border-none rounded-lg mt-2 w-fit";
  const removeBtnClass = "p-2 text-red-400 hover:bg-red-900/30 rounded-full transition-colors self-start mt-8";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header & Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              <span className="text-amber-500">Admin</span> Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage problems and users</p>
          </div>

          <div className="bg-[#1e1e1e] p-1 rounded-xl border border-gray-700 flex gap-1">
            <button
              onClick={switchToCreate}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <PlusCircleIcon className="w-4 h-4" /> {editingProblemId ? "Edit Problem" : "Create Problem"}
            </button>
            <button
              onClick={() => setActiveTab("problems")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'problems' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <DocumentTextIcon className="w-4 h-4" /> Manage Problems
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <UserGroupIcon className="w-4 h-4" /> Manage Users
            </button>
          </div>
        </motion.div>

        {/* CREATE / EDIT TAB */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <SectionCard title={editingProblemId ? "Edit Problem Details" : "New Problem Details"}>
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
                    {["Array", "HashTable", "LinkedList", "Stack", "Queue", "Tree", "Graph", "Trie", "BinarySearch"].map(tag => <option key={tag} value={tag}>{tag}</option>)}
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

            <SectionCard title="Examples">
              <div className="space-y-6">
                <AnimatePresence>
                  {exampleFields.map((field, index) => (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key={field.id} className="bg-[#262626] border border-gray-700 p-4 rounded-xl flex gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label={`Input ${index + 1}`} error={errors.examples?.[index]?.input?.message}><input {...register(`examples.${index}.input`)} className={inputClass} /></InputGroup>
                        <InputGroup label={`Output ${index + 1}`} error={errors.examples?.[index]?.output?.message}><input {...register(`examples.${index}.output`)} className={inputClass} /></InputGroup>
                        <div className="md:col-span-2"><InputGroup label="Explanation"><textarea {...register(`examples.${index}.explanation`)} className={`${inputClass} min-h-[60px]`} /></InputGroup></div>
                      </div>
                      <button type="button" onClick={() => removeExample(index)} className={removeBtnClass}><TrashIcon className="w-5 h-5" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button type="button" onClick={() => addExample({ input: "", output: "", explanation: "" })} className={btnClass}><div className="flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Example</div></button>
              </div>
            </SectionCard>

            <SectionCard title="Test Cases">
              <h3 className="text-gray-400 text-sm mb-4 uppercase tracking-wider font-bold">Visible</h3>
              <div className="space-y-4 mb-8">
                {visibleTestCaseFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4"><div className="flex-1 grid grid-cols-2 gap-4"><input {...register(`visibleTestCase.${index}.input`)} className={inputClass} placeholder="Input" /><input {...register(`visibleTestCase.${index}.output`)} className={inputClass} placeholder="Output" /></div><button type="button" onClick={() => removeVisibleTestCase(index)} className="text-red-500 pt-3"><TrashIcon className="w-5 h-5" /></button></div>
                ))}
                <button type="button" onClick={() => addVisibleTestCase({ input: "", output: "" })} className={btnClass}><div className="flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Visible</div></button>
              </div>
              <h3 className="text-gray-400 text-sm mb-4 uppercase tracking-wider font-bold">Hidden</h3>
              <div className="space-y-4">
                {hiddenTestCaseFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4"><div className="flex-1 grid grid-cols-2 gap-4"><input {...register(`hiddenTestCase.${index}.input`)} className={inputClass} placeholder="Input" /><input {...register(`hiddenTestCase.${index}.output`)} className={inputClass} placeholder="Output" /></div><button type="button" onClick={() => removeHiddenTestCase(index)} className="text-red-500 pt-3"><TrashIcon className="w-5 h-5" /></button></div>
                ))}
                <button type="button" onClick={() => addHiddenTestCase({ input: "", output: "" })} className={btnClass}><div className="flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Hidden</div></button>
              </div>
            </SectionCard>

            <SectionCard title="Solutions & Starter Code">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gray-400 mb-4">Reference Solution</h3>
                  {["cpp", "java", "javascript", "python"].map((lang, idx) => (
                    <div key={`ref-${lang}`} className="mb-4">
                      <input type="hidden" value={lang} {...register(`referenceSolution.${idx}.language`)} />
                      <InputGroup label={lang.toUpperCase()} error={errors.referenceSolution?.[idx]?.solution?.message}>
                        <textarea {...register(`referenceSolution.${idx}.solution`)} className={`${inputClass} font-mono text-xs min-h-[100px]`} placeholder="Solution code..." />
                      </InputGroup>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-gray-400 mb-4">Starter Code</h3>
                  {["cpp", "java", "javascript", "python"].map((lang, idx) => (
                    <div key={`init-${lang}`} className="mb-4">
                      <input type="hidden" value={lang} {...register(`initialCode.${idx}.language`)} />
                      <InputGroup label={lang.toUpperCase()} error={errors.initialCode?.[idx]?.code?.message}>
                        <textarea {...register(`initialCode.${idx}.code`)} className={`${inputClass} font-mono text-xs min-h-[100px]`} placeholder="Starter code..." />
                      </InputGroup>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <div className="flex justify-end pt-5 pb-20">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className={`btn btn-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black border-none font-bold px-10 rounded-2xl shadow-lg ${isSubmitting ? 'loading' : ''}`}>
                {isSubmitting ? 'Saving...' : (editingProblemId ? 'Update Problem' : 'Create Problem')}
              </motion.button>
            </div>
          </form>
        )}

        {/* MANAGE PROBLEMS TAB */}
        {activeTab === 'problems' && (
          <SectionCard title="Manage Problems">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Tags</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map(problem => (
                    <tr key={problem._id} className="hover:bg-[#262626]">
                      <td className="font-bold text-gray-200">{problem.title}</td>
                      <td><span className={`badge ${problem.difficulty === 'hard' ? 'badge-error' : problem.difficulty === 'medium' ? 'badge-warning' : 'badge-success'} badge-outline badge-sm`}>{problem.difficulty}</span></td>
                      <td className="text-gray-400 text-xs">{Array.isArray(problem.tags) ? problem.tags.join(", ") : problem.tags}</td>
                      <td className="text-right space-x-2">
                        <button onClick={() => editProblem(problem._id)} className="btn btn-xs btn-ghost text-blue-400 hover:bg-blue-900/20"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => deleteProblem(problem._id)} className="btn btn-xs btn-ghost text-red-400 hover:bg-red-900/20"><TrashIcon className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {problems.length === 0 && <tr><td colSpan="4" className="text-center text-gray-500 py-8">No problems found</td></tr>}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {/* MANAGE USERS TAB */}
        {activeTab === 'users' && (
          <SectionCard title="Manage Users">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-[#262626]">
                      <td className="font-bold text-gray-200">{user.firstname} {user.lastname}</td>
                      <td className="text-gray-400">{user.emailId}</td>
                      <td><span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'} badge-outline badge-sm`}>{user.role}</span></td>
                      <td className="text-right space-x-2">
                        {/* Simple toggle role for now or delete */}
                        <button onClick={() => deleteUser(user._id)} className="btn btn-xs btn-ghost text-red-400 hover:bg-red-900/20"><TrashIcon className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="4" className="text-center text-gray-500 py-8">No users found</td></tr>}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

      </div>
    </div>
  );
}