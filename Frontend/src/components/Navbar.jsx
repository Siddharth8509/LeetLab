import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <div className="navbar bg-[#1a1a1a] border-b border-gray-800 text-gray-200 px-4">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl font-bold text-amber-500 hover:text-amber-400" onClick={() => navigate("/")}>
                    LeetLab
                </a>
            </div>
            <div className="flex-none gap-4">
                {user?.role === "admin" && (
                    <button
                        className="btn btn-ghost btn-sm hover:text-white text-red-400"
                        onClick={() => navigate("/Admin")}
                    >
                        Admin Panel
                    </button>
                )}
                <button
                    className="btn btn-ghost btn-sm hover:text-white"
                    onClick={() => navigate("/problemSet")}
                >
                    Problems
                </button>
                <button
                    className="btn btn-ghost btn-sm hover:text-white"
                >
                    Contest
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full bg-gray-700 p-2 border border-gray-600">
                            <span className="text-xl font-bold text-center w-full block text-amber-500">
                                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                            </span>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-[#262626] rounded-box z-[1] mt-3 w-52 p-2 shadow border border-gray-700"
                    >
                        <li><a onClick={() => navigate("/Profile")}>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
