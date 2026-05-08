import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heatmap from "../components/Heatmap";
import Habits from "./Habits";
import Analytics from "./Analytics";
import Chat from "./Chat";
import { getAnalytics } from "../api/analyticsApi";

const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
const [showDevBanner, setShowDevBanner] = useState(true);// ✅ banner state
  const [showBugBanner, setShowBugBanner] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const userData = localStorage.getItem("user");
  const user = safeParse(userData);
  const username = user?.name || user?.username || "User";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAnalytics();
      setStats(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ✅ LOADING SKELETON
  if (!stats) {
    return (
      <div className="bg-gray-900 min-h-screen text-white overflow-x-hidden">
        <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-700 rounded mb-6"></div>

          <div className="h-5 w-64 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-80 bg-gray-800 rounded mb-6"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
                <div className="h-4 w-32 bg-gray-700 rounded mb-3"></div>
                <div className="h-6 w-16 bg-gray-600 rounded mb-3"></div>
                <div className="h-2 w-full bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }




  return (
  <div className="bg-gray-900 min-h-screen text-white overflow-x-hidden">

    {/* ✅ DEVELOPMENT BANNER */}
    {showDevBanner && (
      <div className="w-full bg-yellow-500/10 border-b border-yellow-400/30 text-yellow-300 text-sm flex justify-between items-center px-4 py-2">
        <span>
          🚧 Trackiva is currently under development.{" "}
          <span className="font-medium text-yellow-200">
            Your data is safe and securely stored.
          </span>{" "}
          We are continuously improving the experience.
        </span>

        <button
          onClick={() => setShowDevBanner(false)}
          className="ml-4 text-yellow-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    )}

    {/* ✅ BUG FIX BANNER */}
    {showBugBanner && (
      <div className="w-full bg-red-500/10 border-b border-red-400/30 text-red-300 text-sm flex justify-between items-center px-4 py-2">
        <span>
          ⚠️ We recently fixed a habit tracking bug that incorrectly marked some habits as missed.
          Please delete your existing habits and add them again to continue tracking properly.
          We apologize for the inconvenience and appreciate your support while Trackiva continues improving.
        </span>

        <button
          onClick={() => setShowBugBanner(false)}
          className="ml-4 text-red-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    )}

    {/* MAIN CONTENT */}
    <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>

      {/* USER GREETING */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Welcome, {username} 👋
      </h1>

      <p className="text-gray-400 mb-6 text-sm sm:text-base">
        Track your habits and boost your productivity with Trackiva.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400 text-sm">Today's Progress</h2>

          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            {stats.todayPercentage}%
          </p>

          <div className="w-full bg-gray-700 h-2 rounded mt-2">
            <div
              className="bg-green-400 h-2 rounded"
              style={{ width: `${stats.todayPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400 text-sm">Weekly Progress</h2>

          <p className="text-2xl sm:text-3xl font-bold text-blue-400">
            {stats.weeklyPercentage || 0}%
          </p>

          <div className="w-full bg-gray-700 h-2 rounded mt-2">
            <div
              className="bg-blue-400 h-2 rounded"
              style={{ width: `${stats.weeklyPercentage || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400 text-sm">Monthly Progress</h2>

          <p className="text-2xl sm:text-3xl font-bold text-orange-400">
            {stats.monthlyPercentage || 0}%
          </p>

          <div className="w-full bg-gray-700 h-2 rounded mt-2">
            <div
              className="bg-orange-400 h-2 rounded"
              style={{ width: `${stats.monthlyPercentage || 0}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* HABITS */}
      <div className="mt-6 sm:mt-8">
        <Habits />
      </div>

      {/* ANALYTICS + HEATMAP + CHAT */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 sm:mt-8">

        <div className="w-full lg:flex-1 min-w-0">
          <Analytics />
        </div>

        <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0">

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full">
            <Heatmap />
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full">
            <Chat />
          </div>

        </div>

      </div>

    </div>
  </div>
);
}