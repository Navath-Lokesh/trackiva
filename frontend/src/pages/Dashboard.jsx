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

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white overflow-x-hidden"> {/* ✅ FIXED overflow */}

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

        {/* TODAY */}
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

        {/* WEEKLY */}
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

        {/* MONTHLY */}
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

        {/* LEFT */}
        <div className="w-full lg:flex-1 min-w-0"> {/* ✅ FIX prevents overflow */}
          <Analytics />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0"> {/* ✅ FIX alignment */}

          {/* HEATMAP */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full"> {/* ✅ FIX width */}
            <Heatmap />
          </div>

          {/* CHAT */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full">
            <Chat />
          </div>

        </div>

      </div>

    </div>
  );
}