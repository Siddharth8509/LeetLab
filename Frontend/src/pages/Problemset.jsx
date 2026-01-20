import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { UserMinusIcon } from "@heroicons/react/20/solid";
import { logoutUser } from "../authSlice";
import { useNavigate } from "react-router-dom"; // ✅ correct import
import axiosClient from "../utils/axiosClient";

export default function Problemset() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // ✅ must CALL the hook

    const user = useSelector((state) => state.auth.user);
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser()); // ✅ invoke thunk
    };

    // ❌ page cannot be a normal variable
    // ✅ make it state
    const [page, setPage] = useState(1);

    const [problem, setProblem] = useState([]);

    // ---------------- INITIAL FETCH ----------------
    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            try {
                const res = await axiosClient.get("/problem/getAllProblems", {
                    params: {
                        limit: 10,
                        offset: 0,
                    },
                });

                if (mounted) {
                    setProblem(res.data.problems); // ✅ assume backend returns problems[]
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchData(); // ✅ YOU FORGOT TO CALL THIS EARLIER

        return () => {
            mounted = false;
        };
    }, []);

    // ---------------- LOAD MORE ----------------
    useEffect(() => {
        if (page === 1) return; // ⛔ avoid duplicate initial fetch

        let mounted = true;

        async function fetchMore() {
            try {
                const res = await axiosClient.get("/problem/getAllProblems", {
                    params: {
                        limit: 10,
                        offset: (page - 1) * 10,
                    },
                });

                if (mounted) {
                    // ❌ never mutate state directly
                    // ✅ functional update
                    setProblem((prev) => [...prev, ...res.data.problems]);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchMore();

        return () => {
            mounted = false;
        };
    }, [page]);

    // ---------------- AUTH REDIRECT ----------------
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    return (
        <>
            {/* ---------------- HEADER ---------------- */}
            <div className="h-15 w-screen bg-amber-600">
                <div className="flex justify-between mx-auto container py-2.5 px-5">
                    <h1 className="text-3xl font-bold text-black my-2">
                        LeetLab
                    </h1>

                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="bg-black btn btn-wide px-9 py-1"
                        >
                            {user?.firstname}
                        </div>

                        <ul className="dropdown-content bg-base-100 rounded-box z-10 p-2 shadow">
                            <li
                                className="flex justify-center items-center gap-3 p-2 cursor-pointer"
                                onClick={handleLogout}
                            >
                                Logout
                                <UserMinusIcon className="h-5 w-5" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="overflow-x-auto mx-10 my-5">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Problem ID</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Tags</th>
                        </tr>
                    </thead>

                    {/* ❌ you had <tr> wrapping map
                        ✅ map directly inside tbody */}
                    <tbody>
                        {problem.map((prob) => (
                            <tr key={prob._id}>
                                <td>{prob._id}</td>
                                <td>{prob.title}</td>
                                <td>{prob.difficulty}</td>
                                <td>{prob.tags.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ---------------- LOAD MORE BUTTON ---------------- */}
                <div className="flex justify-center mt-6">
                    <button
                        className="btn btn-primary"
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Load More
                    </button>
                </div>
            </div>
        </>
    );
}
