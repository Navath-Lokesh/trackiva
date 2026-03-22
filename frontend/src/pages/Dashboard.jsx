import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

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

      setStats(res.data); // because we standardized response

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h2>Total Habits</h2>
          <p className="text-xl">{stats.totalHabits}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2>Completed Today</h2>
          <p className="text-xl">{stats.completedToday}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2>Today's %</h2>
          <p className="text-xl">{stats.todayPercentage}%</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2>Streak 🔥</h2>
          <p className="text-xl">{stats.streak}</p>
        </div>

      </div>

    </div>
  );
}