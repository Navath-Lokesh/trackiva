import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🔴 ADDED: safe parse function (prevents crash)
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

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔴 UPDATED: safe user extraction (instead of direct JSON.parse)
  const userData = localStorage.getItem("user");
  const user = safeParse(userData);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(res.data);
      setStats(res.data);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* 🔴 ADDED: Welcome Section */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user?.name || "User"} 👋
      </h1>

      <p className="text-gray-500 mb-6">
        Track your habits and boost your productivity with Trackiva.
      </p>

      {/* 🔴 EXISTING: MODERN CARDS WITH PROGRESS BARS */}
      <div className="grid grid-cols-3 gap-6">

        {/* TODAY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Today's Progress</h2>
          <p className="text-3xl font-bold text-green-500">
            {stats.todayPercentage}%
          </p>

          <div className="w-full bg-gray-200 h-2 rounded mt-2">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${stats.todayPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* WEEKLY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Weekly Progress</h2>
          <p className="text-3xl font-bold text-blue-500">
            {stats.weeklyPercentage || 0}%
          </p>

          <div className="w-full bg-gray-200 h-2 rounded mt-2">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${stats.weeklyPercentage || 0}%` }}
            ></div>
          </div>
        </div>

        {/* MONTHLY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Monthly Progress</h2>
          <p className="text-3xl font-bold text-orange-500">
            {stats.monthlyPercentage || 0}%
          </p>

          <div className="w-full bg-gray-200 h-2 rounded mt-2">
            <div
              className="bg-orange-500 h-2 rounded"
              style={{ width: `${stats.monthlyPercentage || 0}%` }}
            ></div>
          </div>
        </div>

      </div>

      <button
        onClick={() => navigate("/habits")} 
        className="mt-4 bg-green-300 hover:bg-green-400 text-white font-bold px-4 py-2 rounded"
      >
        Go to Habits
      </button>

    </div>
  );
}