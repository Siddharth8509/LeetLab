import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { UserMinusIcon } from "@heroicons/react/20/solid";
import { logoutUser } from "../authSlice";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

export default function Problemset() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
  const fetchProblems = async () => {
    const res = await axiosClient.get(`/problem/getAllProblems?page=1`);
    setProblems(res.data.problems);
    setHasMore(res.data.hasMore);
  };

  fetchProblems();
}, []);

  console.log(problems)

  const loadMore = async () => {
  if (!hasMore) return;

  const nextPage = page + 1;
  const res = await axiosClient.get(
    `/problem/getAllProblems?page=${nextPage}`
  );

  setProblems(prev => [...prev, ...res.data.problems]);
  setPage(nextPage);
  setHasMore(res.data.hasMore);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">

        <div className="bg-amber-600 h-16 w-full shadow-md">
          <div className="flex justify-between items-center mx-auto container px-5 h-full">
            <h1 className="text-3xl font-bold text-black">LeetLab</h1>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn font-semibold text-lg capitalize">{user?.firstname}</div>
              <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box  w-52 p-2 shadow">
                <li onClick={handleLogout}>
                  <a className="flex justify-between">
                    Logout
                    <UserMinusIcon className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-5 py-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Problems</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">

              <table className="table w-full">
              
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Action</th>
                </tr>
              </thead>
              
              <tbody>
                {problems.length > 0 ? (
                  problems.map((prob) => ( 
                    <tr key={prob._id} className="hover:bg-gray-50">
                      <td className="font-medium text-lg text-gray-900">{prob.title}</td>
                      <td> 
                        <span className={`badge ${prob.difficulty === 'Easy' ? 'badge-success' : prob.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'} text-white`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(prob.tags) ? prob.tags : [prob.tags]).map((tag, index) => (
                            <span key={index} className="badge badge-outline badge-sm text-black">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/problem/${prob._id}`)} >
                          Solve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-black font-bold py-4">No problems found</td>
                  </tr>
                )}
              </tbody>
              </table>

          </div>
        </div>
        
        <div className="flex justify-center">
            <button className="btn" onClick={loadMore}>Load More..</button>
        </div>

      </div>


    </>
  );
}
