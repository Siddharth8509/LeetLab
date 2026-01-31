import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";

export default function Problemset() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  // Fetch solved problems
  useEffect(() => {
    const fetchSolved = async () => {
      try {
        if (!isAuthenticated) return;
        const res = await axiosClient.get("/problem/user");
        // res.data.problems is the array of solved problems
        const solvedIds = new Set(res.data.problems.map(p => p._id));
        setSolvedProblems(solvedIds);
      } catch (error) {
        console.error("Error fetching solved status:", error);
      }
    };
    fetchSolved();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axiosClient.get(`/problem/getAllProblems?page=1`);
        setProblems(res.data.problems);
        setHasMore(res.data.hasMore);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const loadMore = async () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    try {
      const res = await axiosClient.get(
        `/problem/getAllProblems?page=${nextPage}`
      );

      setProblems((prev) => [...prev, ...res.data.problems]);
      setPage(nextPage);
      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error("Error loading more problems:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Problems</h2>
            <p className="text-gray-400">Master algorithms and data structures with our curated list.</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search questions..."
              className="input input-bordered bg-[#1a1a1a] border-gray-700 text-sm w-full md:w-64 focus:outline-none focus:border-amber-500"
            />
            <button className="btn bg-amber-600 hover:bg-amber-700 text-white border-none">
              Search
            </button>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-[#202020] text-gray-400 border-b border-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-4 pl-6 font-medium">Status</th>
                  <th className="py-4 font-medium">Title</th>
                  <th className="py-4 font-medium">Difficulty</th>
                  <th className="py-4 font-medium">Tags</th>
                  <th className="py-4 pr-6 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {problems.length > 0 ? (
                  problems.map((prob) => (
                    <tr
                      key={prob._id}
                      className="group hover:bg-[#252525] transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/problem/${prob._id}`)}
                    >
                      <td className="pl-6">
                        {solvedProblems.has(prob._id) ? (
                          <div className="flex items-center justify-center w-5 h-5 bg-green-500/20 rounded-full border border-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-amber-500 transition-colors"></div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-lg text-gray-200 group-hover:text-amber-500 transition-colors">
                          {prob.title}
                        </div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(prob.difficulty)}`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(prob.tags) ? prob.tags : [prob.tags]).slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {(Array.isArray(prob.tags) ? prob.tags : [prob.tags]).length > 3 && (
                            <span className="text-xs text-gray-500 self-center">...</span>
                          )}
                        </div>
                      </td>
                      <td className="text-right pr-6">
                        <button
                          className="btn btn-sm btn-ghost text-gray-400 group-hover:text-white group-hover:bg-amber-600 transition-all opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/problem/${prob._id}`);
                          }}
                        >
                          Solve Output
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-10 font-medium">
                      No problems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
