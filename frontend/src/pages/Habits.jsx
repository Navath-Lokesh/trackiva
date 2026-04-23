import { useEffect, useState } from "react";
import { createHabit, getHabits, deleteHabit } from "../api/habitApi";
import { markHabit, getMonthlyProgress } from "../api/progressApi";

export default function Habits() {
  const [title, setTitle] = useState("");
  const [habits, setHabits] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    fetchAll();
  }, [month, year]);

  const fetchAll = async () => {
    await fetchHabits();
    await fetchProgress();
  };

  const fetchHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data);
    } catch (err) {
      console.log("Habit fetch error:", err);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await getMonthlyProgress(month, year);

      const map = {};
      const progressData = Array.isArray(res.data) ? res.data : [];

      progressData.forEach((p) => {
        const date = new Date(p.date).getDate();
        map[`${p.habitId}-${date}`] = p.status;
      });

      setProgressMap(map);
    } catch (err) {
      console.log("Progress fetch error:", err);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await createHabit({ title });
      setTitle("");
      await fetchHabits();
    } catch (err) {
      console.log("Add habit error:", err);
    }
  };

  const handleClick = async (habitId, day) => {
    try {
      const date = new Date(Date.UTC(year, month - 1, day));

      await markHabit({
        habitId,
        date,
        status: "done"
      });

      // await fetchProgress();
      await fetchAll();
    } catch (err) {
      console.log("Mark habit error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      await fetchAll();
    } catch (err) {
      console.log("Delete habit error:", err);
    }
  };

  // ✅ Future check
  const isFuture = (day) => {
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  };

  // ✅ NEW: Check if date is BEFORE habit creation
  const isBeforeCreation = (habitCreatedAt, day) => {
    const selectedDate = new Date(year, month - 1, day);
    const createdDate = new Date(habitCreatedAt);

    // normalize time
    selectedDate.setHours(0, 0, 0, 0);
    createdDate.setHours(0, 0, 0, 0);

    return selectedDate < createdDate;
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div className="p-6 bg-gray-900 text-white mt-2">
      <div className="bg-gray-800 p-6 rounded-2xl shadow border border-gray-700">

        {/* Top */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Habits</h1>
          <h1 className="bg-green-200 border-black rounded text-black w-9">
            April
          </h1>
          <div className="text-sm text-gray-400">
            Total habits: {habits.length}
          </div>
        </div>

        {/* Add Habit */}
        <div className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New habit..."
            className="bg-gray-700 border border-gray-600 text-white p-2 rounded-lg w-56 outline-none placeholder-gray-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center mb-3">
          <div className="w-32 font-medium mr-3 text-gray-300">Habit</div>

          <div className="flex gap-1.5 text-xs text-gray-400">
            {[...Array(daysInMonth)].map((_, i) => (
              <div key={i} className="w-6 text-center">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Habit Rows */}
        {habits.map((habit) => (
          <div key={habit._id} className="flex gap-2 items-center mb-2">

            {/* Habit Info */}
            <div className="w-32 flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-lg border border-gray-600">
              <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center rounded-full text-xs">
                ✔
              </div>

              <span className="text-sm truncate text-gray-200">
                {habit.title}
              </span>

              <button
                onClick={() => handleDelete(habit._id)}
                className="ml-auto bg-red-500 hover:bg-red-600 transition w-5 h-5 rounded text-xs flex items-center justify-center"
              >
                <span className="text-white font-bold">X</span>
              </button>
            </div>

            {/* Day Boxes */}
            <div className="flex gap-1.5 ml-1">
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const key = `${habit._id}-${day}`;
                const status = progressMap[key];

                // ✅ NEW: check both conditions
                const future = isFuture(day);
                const beforeCreation = isBeforeCreation(habit.createdAt, day);

                let bg = "bg-gray-700";

                if (status === "done") bg = "bg-green-500";
                else if (status === "missed") bg = "bg-orange-400";

                return (
                  <div
                    key={i}
                    onClick={() => {
                      // ✅ UPDATED: prevent click if locked
                      if (future || beforeCreation || status) return;
                      handleClick(habit._id, day);
                    }}
                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition ${
                      future || beforeCreation
                        ? "bg-gray-600 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${bg}`}
                  >
                    {
                      // ✅ UPDATED: show lock for both cases
                      future || beforeCreation
                        ? "🔒"
                        : status === "done"
                        ? "✔"
                        : status === "missed"
                        ? "✖"
                        : ""
                    }
                  </div>
                );
              })}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}