import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Heatmap from "../components/Heatmap";
import Habits from "./Habits";
import Analytics from "./Analytics";
import Chat from "./Chat";

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
    localStorage.removeItem("user"); // 🔴 ADDED: clear user also
    navigate("/");
  };

  // 🔴 UPDATED: safe user extraction
  const userData = localStorage.getItem("user");
  const user = safeParse(userData);

  // 🔴 ADDED: extract correct username (handles both cases)
  const username = user?.name || user?.username || "User";

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
      </div>

      {/* 🔴 UPDATED: use username variable */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {username} 👋
      </h1>

      <p className="text-gray-500 mb-6">
        Track your habits and boost your productivity with Trackiva.
      </p>

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

      <Habits/>

      <div className=" flex w-[1100px] h-[500px]">
        <div className="w-2xl">
          <Analytics/>
        </div>

        <div className="mt-15 ml-18">
          <Heatmap/>
        </div>

        <div className="mt-[300px] mr-7">
          <Chat/>
        </div>
      </div>

    </div>
  );
}