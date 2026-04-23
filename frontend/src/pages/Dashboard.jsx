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
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white animate-pulse">

      {/* Header Skeleton */}
      <div className="h-6 w-40 bg-gray-700 rounded mb-6"></div>

      {/* Greeting */}
      <div className="h-5 w-64 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-80 bg-gray-800 rounded mb-6"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700"
          >
            <div className="h-4 w-32 bg-gray-700 rounded mb-3"></div>
            <div className="h-6 w-16 bg-gray-600 rounded mb-3"></div>
            <div className="h-2 w-full bg-gray-700 rounded"></div>
          </div>
        ))}

      </div>

      {/* Habits Skeleton */}
      <div className="mt-8">
        <div className="h-5 w-32 bg-gray-700 rounded mb-4"></div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="w-32 h-6 bg-gray-700 rounded"></div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className="w-5 h-5 bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

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