import { Bar } from "react-chartjs-2"; // 🔴 UPDATED: replaced Line with Bar
import { useEffect, useState } from "react";
import { getAnalytics } from "../api/analyticsApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement // 🔴 ADDED: required for bar chart
} from "chart.js";

// 🔴 UPDATED: register BarElement instead of LineElement
ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function Analytics() {

  // 🔴 ADDED: state inside component (correct place)
  const [analytics, setAnalytics] = useState(null);

  // 🔴 ADDED: fetch on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 🔴 ADDED: API call
  const fetchAnalytics = async () => {
    const res = await getAnalytics();
    setAnalytics(res.data);

    console.log(res.data);
  };

  // 🔴 ADDED: loading state
  if (!analytics) return <div>Loading...</div>;

  // 🔴 UPDATED: dynamic chart data (replaced static weekly data)
  const data = {
    labels: ["Completed", "Missed"],
    datasets: [
      {
        label: "Habits",
        data: [analytics.completed || 0, 
        (analytics.totalHabits || 0) - (analytics.completed || 0) ],
        backgroundColor: ["green", "red"]
      }
    ]
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {/* 🔴 UPDATED: Bar chart instead of Line chart */}
        <Bar data={data} />
      </div>

      {/* 🔴 EXISTING: Habit-wise Progress Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-white p-4 rounded shadow">
          <p>Workout</p>
          <div className="bg-gray-200 h-2 rounded mt-2">
            <div className="bg-green-500 h-2 rounded w-[80%]"></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Reading</p>
          <div className="bg-gray-200 h-2 rounded mt-2">
            <div className="bg-green-500 h-2 rounded w-[60%]"></div>
          </div>
        </div>

      </div>

    </div>
  );
}