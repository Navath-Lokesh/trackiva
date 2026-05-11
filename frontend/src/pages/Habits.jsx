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
        status: "done",
      });

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




  


  const isFuture = (day) => {
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  };

  const isBeforeCreation = (habitCreatedAt, day) => {
    const selectedDate = new Date(year, month - 1, day);
    const createdDate = new Date(habitCreatedAt);

    selectedDate.setHours(0, 0, 0, 0);
    createdDate.setHours(0, 0, 0, 0);

    return selectedDate < createdDate;
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white mt-2 overflow-x-hidden">

      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow border border-gray-700">

        {/* Top */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">Habits</h1>

          <div className="flex items-center gap-2">

             



            <h1 className="bg-green-200 rounded text-black px-2 text-sm">
              May
            </h1>

            <div className="text-xs sm:text-sm text-gray-400">
              Total Habits : {habits.length}
            </div>
          </div>
        </div>

        {/* Add Habit */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New habit..."
            className="bg-gray-700 border border-gray-600 text-white p-2 rounded-lg w-full sm:w-56 outline-none placeholder-gray-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Add
          </button>
         
        </div>

        {/* Scroll */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">

            {/* HEADER ✅ GRID FIX */}
            <div
              className="grid items-center mb-3"
              style={{
                gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(24px, 1fr))`,
              }}
            >
              <div className="text-gray-300 font-medium">Habit</div>

              {[...Array(daysInMonth)].map((_, i) => (
                <div key={i} className="text-center text-xs text-gray-400">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* ROWS ✅ SAME GRID */}
            {habits.map((habit) => (
              <div
                key={habit._id}
                className="grid items-center mb-2"
                style={{
                  gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(24px, 1fr))`,
                }}
              >
                {/* Habit */}
                <div className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-lg border border-gray-600">
                  <div className="w-5 h-5 bg-green-500 flex items-center justify-center rounded-full text-xs">
                    ✔
                  </div>

                  <span className="text-sm truncate text-gray-200">
                    {habit.title}
                  </span>

                  {/* <button
                    onClick={() => handleDelete(habit._id)}
                    className="ml-auto bg-red-500 hover:bg-red-600 w-5 h-5 rounded text-xs flex items-center justify-center"
                  >
                    X
                  </button> */}

                  {/* <button
  onClick={() => handleDelete(habit._id)}
  title="Delete this habit"
  className="ml-auto bg-red-500 hover:bg-red-600 
             w-6 h-6 min-w-[24px] min-h-[24px]
             flex-shrink-0
             rounded text-xs flex items-center justify-center"
>
  X
</button> */}
<div className="relative group ml-auto">
  <button
    onClick={() => handleDelete(habit._id)}
    className="bg-red-500 hover:bg-red-600 
               w-6 h-6 min-w-[24px] min-h-[24px]
               flex-shrink-0 rounded-md text-xs
               flex items-center justify-center
               text-white font-semibold
               transition-all duration-200
               hover:scale-110 active:scale-95
               shadow-sm hover:shadow-red-500/40"
  >
    ✕
  </button>

  {/* Premium Tooltip */}
  <div
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
               opacity-0 group-hover:opacity-100
               pointer-events-none
               transition-all duration-150
               translate-y-1 group-hover:translate-y-0
               bg-black text-white text-[11px]
               px-3 py-1.5 rounded-lg whitespace-nowrap
               shadow-xl border border-gray-700 z-50"
  >
    Delete this habit
  </div>
</div>
                </div>

                {/* Days */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const key = `${habit._id}-${day}`;
                  const status = progressMap[key];

                  const future = isFuture(day);
                  const beforeCreation = isBeforeCreation(
                    habit.createdAt,
                    day
                  );

                  let bg = "bg-gray-700";
                  if (status === "done") bg = "bg-green-500";
                  else if (status === "missed") bg = "bg-red-500";  // code changed here

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (future || beforeCreation || status) return;
                        handleClick(habit._id, day);
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold mx-auto ${
                        future || beforeCreation
                          ? "bg-gray-600 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${bg}`}
                    >
                      {future || beforeCreation
                        ? "🔒"
                        : status === "done"
                        ? "✔"
                        : status === "missed"
                        ? "✖"
                        : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}