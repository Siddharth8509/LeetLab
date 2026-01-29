import { useState, useEffect } from "react";
import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex items-center gap-3 bg-neutral-900 text-white px-4 py-2 rounded-full shadow-lg w-fit">
      
      {/* Time */}
      <span className="font-mono text-lg tracking-wide">
        {formatTime()}
      </span>

      {/* Start / Pause */}
      {!running ? (
        <button onClick={() => setRunning(true)} className="text-green-400 hover:text-green-300 transition">
          <PlayIcon className="w-5 h-5" />
        </button>
      ) : (
        <button onClick={() => setRunning(false)} className="text-yellow-400 hover:text-yellow-300 transition">
          <PauseIcon className="w-5 h-5" />
        </button>
      )}

      {/* Reset */}
      <button onClick={() => { setRunning(false); setSeconds(0);} }className="text-gray-400 hover:text-gray-200 transition">
        <ArrowPathIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
