import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

// 🔴 FIXED: make sure file name matches correctly
import { getAnalytics } from "../api/analyticsApi"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true); // 🔴 ADDED loading state

  useEffect(() => {
    fetchAnalytics();
  }, []); // ✅ runs on mount

  const fetchAnalytics = async () => {
    try {
      setLoading(true); // 🔴 ADDED

      const res = await getAnalytics();

      console.log("Analytics API:", res.data); // 🔴 DEBUG

      setAnalytics(res.data);

    } catch (err) {
      console.log(err.response?.data || err.message); // 🔴 ADDED error handling
    } finally {
      setLoading(false); // 🔴 ADDED
    }
  };

  // 🔴 UPDATED: better loading condition
  if (loading) return <div>Loading analytics...</div>;

  // 🔴 FIXED: safe fallback
  const habits = analytics?.habitStats || [];

  // 🔴 ADDED: empty state UI
  if (habits.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-gray-500 mt-2">
          No analytics data available yet.
        </p>
      </div>
    );
  }

  // ✅ Chart data
  const data = {
    labels: habits.map(h => h.title),
    datasets: [
      {
        label: "Completion %",
        data: habits.map(h => h.percentage),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">

        <div className="h-[300px]">
          <Bar 
            data={data} 
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>

      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">

        {habits.map((habit, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">

            <div className="flex justify-between mb-2">
              <p className="font-medium capitalize">{habit.title}</p>
              <p className="text-gray-500">{habit.percentage}%</p>
            </div>

            <div className="bg-gray-200 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${habit.percentage}%` }}
              ></div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}