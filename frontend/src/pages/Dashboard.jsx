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
    <div className="p-6 bg-gray-900 min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button> */}
      </div>

      {/* USER GREETING */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {username} 👋
      </h1>

      <p className="text-gray-400 mb-6">
        Track your habits and boost your productivity with Trackiva.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">

        {/* TODAY */}
        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400">Today's Progress</h2>
          <p className="text-3xl font-bold text-green-400">
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
        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400">Weekly Progress</h2>
          <p className="text-3xl font-bold text-blue-400">
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
        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-gray-400">Monthly Progress</h2>
          <p className="text-3xl font-bold text-orange-400">
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
      <div className="mt-8">
        <Habits />
      </div>

      {/* ANALYTICS + HEATMAP + CHAT */}
      <div className="flex gap-6 mt-8">

        <div className="flex-1">
          <Analytics />
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <Heatmap />
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <Chat />
          </div>

        </div>

      </div>

    </div>
  );
}