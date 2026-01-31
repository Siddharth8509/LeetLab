import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { motion } from "motion/react";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get("/user/profile");
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="h-screen bg-[#1a1a1a] text-white flex justify-center items-center">Loading...</div>;

    const { user, stats, recentSubmissions } = profile;

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-gray-200 p-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 bg-[#262626] p-6 rounded-3xl border border-gray-700 shadow-xl"
                >
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl font-bold text-black border-4 border-[#1a1a1a]">
                        {user.firstname?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{user.firstname} {user.lastname}</h1>
                        <p className="text-gray-400">@{user.username || user.firstname}</p>
                        <div className="mt-2 flex gap-2">
                            <span className="badge badge-accent badge-outline">{user.role}</span>
                            <span className="badge badge-primary badge-outline">Rank 1</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 flex flex-col gap-4"
                    >
                        <div className="bg-[#262626] p-6 rounded-3xl border border-gray-700 shadow-lg">
                            <h2 className="text-xl font-bold mb-6 text-gray-100">Solved Problems</h2>

                            <div className="flex justify-center mb-6">
                                <div className="radial-progress text-amber-500 font-bold text-2xl" style={{ "--value": 70, "--size": "8rem", "--thickness": "0.5rem" }} role="progressbar">
                                    {stats.totalSolved}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-green-400">Easy</span>
                                        <span className="font-mono">{stats.easySolved}</span>
                                    </div>
                                    <progress className="progress progress-success w-full bg-gray-700" value={stats.easySolved} max={Math.max(stats.totalSolved, 20)}></progress>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-yellow-400">Medium</span>
                                        <span className="font-mono">{stats.mediumSolved}</span>
                                    </div>
                                    <progress className="progress progress-warning w-full bg-gray-700" value={stats.mediumSolved} max={Math.max(stats.totalSolved, 20)}></progress>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-red-400">Hard</span>
                                        <span className="font-mono">{stats.hardSolved}</span>
                                    </div>
                                    <progress className="progress progress-error w-full bg-gray-700" value={stats.hardSolved} max={Math.max(stats.totalSolved, 20)}></progress>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 bg-[#262626] p-6 rounded-3xl border border-gray-700 shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-6 text-gray-100">Recent Submissions</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="text-gray-400 border-gray-700">
                                        <th>Problem</th>
                                        <th>Status</th>
                                        <th>Runtime</th>
                                        <th>Language</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSubmissions.length > 0 ? (
                                        recentSubmissions.map((sub) => (
                                            <tr key={sub._id} className="border-gray-700 hover:bg-[#333] transition-colors">
                                                <td className="font-medium text-white">{sub.problemId?.title || "Unknown"}</td>
                                                <td className={
                                                    sub.status === "accepted" ? "text-green-400 font-bold" :
                                                        sub.status === "wrong_answer" ? "text-red-400" : "text-yellow-400"
                                                }>
                                                    {sub.status === "accepted" ? "Accepted" :
                                                        sub.status === "wrong_answer" ? "Wrong Answer" :
                                                            sub.status}
                                                </td>
                                                <td className="font-mono text-gray-400">{sub.runtime} ms</td>
                                                <td>
                                                    <div className="badge badge-neutral badge-sm uppercase">{sub.language}</div>
                                                </td>
                                                <td className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-gray-500 py-8">No submissions yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
