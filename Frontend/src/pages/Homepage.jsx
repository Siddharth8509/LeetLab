import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden relative">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="hero min-h-[calc(100vh-64px)]">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl px-4">
                            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-500 pb-2">
                                Master Code.
                            </h1>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                Conquer Interviews.
                            </h1>
                            <p className="py-6 text-xl text-gray-400">
                                The ultimate platform to practice coding problems, run test cases, and level up your skills. Join thousands of developers today.
                            </p>
                            <div className="flex gap-4 justify-center mt-4">
                                <button
                                    className="btn btn-lg bg-amber-500 hover:bg-amber-600 text-black border-none px-8 text-lg"
                                    onClick={() => navigate("/problemSet")}
                                >
                                    Start Practicing 🚀
                                </button>
                                <button className="btn btn-lg btn-outline text-white hover:bg-white hover:text-black hover:border-white px-8 text-lg">
                                    View Contests
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-20 border-t border-gray-800 pt-10">
                                <div>
                                    <div className="text-3xl font-bold text-white">1000+</div>
                                    <div className="text-gray-500">Problems</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">50k+</div>
                                    <div className="text-gray-500">Users</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">24/7</div>
                                    <div className="text-gray-500">Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}