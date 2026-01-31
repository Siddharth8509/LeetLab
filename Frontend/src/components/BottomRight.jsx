import { useEffect, useState } from "react";

export default function BottomRight({ prop, runResult }) {

  const [example, setExample] = useState(0);
  const [activeTab, setActiveTab] = useState("testcases");

  // Automatically switch to 'result' tab when runResult is populated
  useEffect(() => {
    if (runResult) {
      setActiveTab("result");
    }
  }, [runResult]);

  function testCaseHandler(value) {
    return setExample(value);
  };

  // currentResult needs to combine runResult data with test case data for input/expectedOutput
  const currentResult = runResult && runResult[example]
    ? {
      ...runResult[example],
      input: prop?.visibleTestCase[example]?.input,
      expectedOutput: prop?.visibleTestCase[example]?.output,
    }
    : null;

  return (
    <div className="h-full bg-gray-800 flex flex-col">

      {/* TABS HEADER */}
      <div className="h-10 bg-gray-900/50 flex items-center border-b border-gray-700">
        <button
          onClick={() => setActiveTab("testcases")}
          className={`h-full px-4 text-sm font-semibold flex items-center gap-2 border-r border-gray-700 transition-colors ${activeTab === 'testcases'
              ? 'bg-gray-800 text-white border-t-2 border-t-amber-500'
              : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <span className="text-green-500">✔</span> Test Cases
        </button>
        <button
          onClick={() => setActiveTab("result")}
          className={`h-full px-4 text-sm font-semibold flex items-center gap-2 border-r border-gray-700 transition-colors ${activeTab === 'result'
              ? 'bg-gray-800 text-white border-t-2 border-t-amber-500'
              : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <span>⚡</span> Run Result
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">

        {/* ================= TEST CASES TAB ================= */}
        {activeTab === "testcases" && (
          <div className="p-4 flex flex-col gap-4">
            {/* Case Selectors */}
            <div className="flex gap-2">
              {prop?.visibleTestCase.map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${example === index
                      ? "bg-gray-600 text-white"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    }`}
                  onClick={() => testCaseHandler(index)}
                >
                  Case {index + 1}
                </button>
              ))}
            </div>

            {/* Input Display */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400">Input</p>
              <div className="bg-gray-700 rounded-lg p-3 font-mono text-sm text-gray-200">
                {prop?.visibleTestCase[example].input}
              </div>
            </div>

            {/* Output Display */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400">Expected Output</p>
              <div className="bg-gray-700 rounded-lg p-3 font-mono text-sm text-gray-200">
                {prop?.visibleTestCase[example].output}
              </div>
            </div>
          </div>
        )}

        {/* ================= RUN RESULT TAB ================= */}
        {activeTab === "result" && (
          <div className="p-4 h-full">
            {!runResult ? (
              <div className="h-full flex items-center justify-center text-gray-500 italic">
                Run logic to view results.
              </div>
            ) : (
              <div className="flex flex-col gap-4">

                {/* Result Case Selectors */}
                <div className="flex gap-2 mb-2">
                  {runResult.map((res, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${example === index
                          ? "bg-gray-600 text-white ring-1 ring-gray-500"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        }`}
                      onClick={() => testCaseHandler(index)}
                    >
                      <span className={`w-2 h-2 rounded-full ${res.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}></span>
                      Case {index + 1}
                    </button>
                  ))}
                </div>

                {/* Status Header */}
                <div className={`text-xl font-bold ${currentResult.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                  {currentResult.status}
                </div>

                {/* Error Message (if any) */}
                {currentResult.error && (
                  <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg text-red-200 text-sm font-mono whitespace-pre-wrap">
                    {currentResult.error}
                  </div>
                )}

                {/* Input / Output Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Input</p>
                    <div className="bg-gray-700/50 p-3 rounded-lg text-sm font-mono text-gray-300">
                      {currentResult.input}
                    </div>
                  </div>

                  {/* Spacer for grid alignment if needed, or just standard flow */}

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Expected Output</p>
                    <div className="bg-gray-700/50 p-3 rounded-lg text-sm font-mono text-gray-300">
                      {currentResult.expectedOutput}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Actual Output</p>
                    <div className={`p-3 rounded-lg text-sm font-mono border ${currentResult.status === 'Accepted'
                        ? 'bg-green-900/20 border-green-500/30 text-green-200'
                        : 'bg-red-900/20 border-red-500/30 text-red-200'
                      }`}>
                      {currentResult.actualOutput}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}