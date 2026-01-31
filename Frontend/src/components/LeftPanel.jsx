import { TagIcon, BriefcaseIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import axiosClient from "../utils/axiosClient";
import { motion, AnimatePresence } from "motion/react";

export default function LeftPanel({ prop }) {
  const { problemData, submissionResult } = prop;

  const difficultyColor = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  const companies = problemData?.companies?.[0]?.split(",") || [];
  const markdown = problemData?.editorial || "No editorial found";

  const [activeTab, setActiveTab] = useState("description");
  const [submission, setSubmission] = useState([])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        if (!problemData?._id) return;
        const response = await axiosClient.get(`/problem/submission/${problemData._id}`);
        setSubmission(response.data);
      } catch (error) {
        console.log("Error fetching submissions: " + error.message);
      }
    };
    fetchSubmissions();
  }, [problemData?._id]);

  useEffect(() => {
    if (submissionResult) {
      setActiveTab("result");
    }
  }, [submissionResult]);

  return (
    <div className="px-2 py-1 bg-gray-800 h-full min-h-0 overflow-y-auto no-scrollbar scroll-smooth">

      {/* Tabs */}
      <div className="h-11 flex items-center gap-3 px-1">
        <button
          className="btn rounded-2xl btn-sm bg-yellow-400 text-yellow-800 font-bold"
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          className="btn rounded-2xl btn-sm bg-green-400 text-green-800 font-bold"
          onClick={() => setActiveTab("editorial")}
        >
          Editorial
        </button>

        <button
          className="btn rounded-2xl btn-sm bg-blue-400 text-blue-800 font-bold"
          onClick={() => setActiveTab("submission")}
        >
          Submissions
        </button>

        <button
          className="btn rounded-2xl btn-sm bg-red-400 text-red-800 font-bold"
          onClick={() => setActiveTab("ai")}
        >
          Ask AI ⭐
        </button>
      </div>

      <hr className="border-dashed" />

      <AnimatePresence mode="wait">
        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <motion.div
            key="description"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2 mt-2">

              <h1 className="font-bold text-3xl">
                {problemData?.title}
              </h1>

              <div className="flex gap-2">
                <button
                  className={`btn rounded-3xl font-bold text-black ${difficultyColor[problemData?.difficulty] || "bg-gray-400"
                    }`}
                >
                  {problemData?.difficulty || "Loading"}
                </button>

                <button className="btn rounded-3xl">
                  <TagIcon className="w-4 h-4" />
                  Topics
                </button>

                <button className="btn rounded-3xl">
                  <BriefcaseIcon className="w-4 h-4" />
                  Companies
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 italic text-[16px]">
              <p className="whitespace-pre-line">
                {problemData?.description}
              </p>
            </div>

            {/* Examples */}
            <div className="flex flex-col gap-4 pt-5">
              {problemData?.examples?.map((e, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-600 rounded-xl"
                >
                  <div className="px-4 py-3 flex flex-col gap-2 text-sm">
                    <p className="font-semibold text-yellow-400">
                      Example {index + 1}
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Input:</span>{" "}
                      <span className="font-mono text-gray-200">{e.input}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-blue-400">Output:</span>{" "}
                      <span className="font-mono text-gray-200">{e.output}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-purple-400">
                        Explanation:
                      </span>{" "}
                      <span className="text-gray-300">{e.explanation}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="mt-10 flex flex-col gap-2">

              <details className="group collapse">
                <summary className="collapse-title font-semibold flex justify-between cursor-pointer">
                  Topics
                  <ChevronDownIcon className="w-5 h-5 group-open:rotate-180" />
                </summary>
                <div className="collapse-content">
                  <button className="btn btn-disabled rounded-3xl btn-sm bg-gray-400 text-black">
                    {problemData?.tags}
                  </button>
                </div>
              </details>

              <hr className="border-dashed" />

              <details className="group collapse">
                <summary className="collapse-title font-semibold flex justify-between cursor-pointer">
                  Companies
                  <ChevronDownIcon className="w-5 h-5 group-open:rotate-180" />
                </summary>
                <div className="collapse-content">
                  {companies.map((company, index) => (
                    <button
                      key={index}
                      className="btn btn-disabled rounded-3xl btn-sm bg-gray-400 text-black mr-2 mb-2"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </details>

            </div>
          </motion.div>
        )}

        {/* EDITORIAL */}
        {activeTab === "editorial" && (
          <motion.div
            key="editorial"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="overflow-y-auto text-gray-300 space-y-6"
          >
            <Markdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white border-b border-gray-700 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-white">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="leading-relaxed">{children}</p>
                ),
                pre: ({ children }) => (
                  <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                    {children}
                  </pre>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="text-pink-400 bg-gray-900 px-1 rounded">
                      {children}
                    </code>
                  ) : (
                    <code className="text-gray-200">{children}</code>
                  ),
              }}
            >
              {markdown}
            </Markdown>
          </motion.div>
        )}

        {/* SUBMISSIONS */}
        {activeTab === "submission" && (
          <motion.div
            key="submission"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col gap-3 px-2 py-2"
          >

            {submission.length === 0 ? (
              <p className="text-gray-400 italic">
                No submissions found.
              </p>
            ) : (
              submission.map((sub, index) => {
                const statusColor =
                  sub.status === "Accepted"
                    ? "text-green-400"
                    : sub.status === "Wrong Answer"
                      ? "text-red-400"
                      : "text-yellow-400";

                return (
                  <div
                    key={sub._id}
                    className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 flex justify-between items-center hover:border-gray-500 transition"
                  >
                    {/* LEFT */}
                    <div className="flex flex-col gap-1">
                      <span className={`font-semibold ${statusColor}`}>
                        {sub.status || "Pending"}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(sub.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-6 text-sm text-gray-300">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-xs">Runtime</span>
                        <span>{sub.runtime || "-- ms"}</span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-xs">Memory</span>
                        <span>{sub.memory || "-- MB"}</span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-gray-400 text-xs">Language</span>
                        <span className="uppercase">{sub.language}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </motion.div>
        )}

        {/* RESULT */}
        {activeTab === "result" && submissionResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 px-4 py-4 text-white"
          >
            <div className={`text-2xl font-bold ${submissionResult.status === "accepted" ? "text-green-500" : "text-red-500"}`}>
              {submissionResult.status === "accepted" ? "Accepted" :
                submissionResult.status === "wrong_answer" ? "Wrong Answer" :
                  submissionResult.status === "runtime_error" ? "Runtime Error" : submissionResult.status}
            </div>

            {submissionResult.errorMessage && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 font-mono text-sm whitespace-pre-wrap">
                {submissionResult.errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm mb-1">Runtime</div>
                <div className="text-xl font-mono">{submissionResult.runtime} ms</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm mb-1">Memory</div>
                <div className="text-xl font-mono">{submissionResult.memory} KB</div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Test Cases Passed</span>
                <span className="text-white font-bold">{submissionResult.testCasesPassed} / {submissionResult.testCasesTotal}</span>
              </div>
              <progress
                className={`progress w-full ${submissionResult.testCasesPassed === submissionResult.testCasesTotal ? "progress-success" : "progress-error"}`}
                value={submissionResult.testCasesPassed}
                max={submissionResult.testCasesTotal}>
              </progress>
            </div>

            <button
              className="btn btn-outline btn-sm mt-4 w-full"
              onClick={() => setActiveTab("submission")}
            >
              View All Submissions
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
