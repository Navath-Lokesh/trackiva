import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-center p-6">
        Loading analytics...
      </div>
    );
  }

  const habits = analytics?.habitStats || [];

  if (habits.length === 0) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-2">
          No analytics data available yet.
        </p>
      </div>
    );
  }

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
    <div className="p-6 bg-gray-900 text-white">

      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700 max-w-4xl mx-auto">
        <div className="h-[300px]">
          <Bar
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: {
                  ticks: { color: "#9CA3AF" },
                  grid: { color: "#374151" }
                },
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { color: "#9CA3AF" },
                  grid: { color: "#374151" }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">

        {habits.map((habit) => (
          <div
            key={habit.habitId}
            className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700"
          >

            <div className="flex justify-between mb-2">
              <p className="font-medium capitalize text-gray-200">
                {habit.title}
              </p>
              <p className="text-gray-400">
                {habit.percentage}%
              </p>
            </div>

            <div className="bg-gray-700 h-2 rounded">
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