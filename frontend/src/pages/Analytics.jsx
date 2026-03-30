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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await getAnalytics();
    setAnalytics(res.data);
  };

  if (!analytics) return <div>Loading...</div>;

  // ✅ Dynamic habit data
  const habits = analytics.habitStats || [];

  // ✅ Chart data (per habit)
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

      {/* Habit Cards (REAL DATA) */}
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