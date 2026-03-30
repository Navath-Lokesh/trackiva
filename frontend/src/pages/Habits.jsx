import { useEffect, useState } from "react";
import { createHabit, getHabits, deleteHabit } from "../api/habitApi";
import { markHabit, getMontlyProgress } from "../api/progressApi";


export default function Habits() {

  const [title, setTitle] = useState("");
  const [habits, setHabits] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async() =>{
    await fetchHabits();
    await fetchProgress();
  }

  const fetchHabits = async () => {
    const res = await getHabits();

    const habitsData = Array.isArray(res.data.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : [];
    setHabits(habitsData);
  };

  const fetchProgress = async () =>{
    const res = await getMontlyProgress(3,2026);
    
    const map = {};

    const progressData  = Array.isArray(res.data) ? res.data : [];
    progressData.forEach(p =>{
    // res.data.forEach(p=>{
        const date = new Date(p.date).getDate();
        map[`${p.habitId}-${date}`] = p.status;
    });
    setProgressMap(map);
  }

  const handleAdd = async () => {
    if (!title.trim()) return;

    await createHabit({ title });
    setTitle("");
    fetchHabits();
  };

  const handleClick = async (habitId, day) => {
    const date = new Date(2026, 2, day);

    await markHabit({
      habitId,
      date,
      status: "done"
    });

    fetchProgress();
  };

  const handleDelete = async (id) =>{
    await deleteHabit(id);
    fetchAll();
  }

  const getColor = (habitId,day) =>{
    const key = `${habitId}-${day}`;
    const status = progressMap[key];

    if(status === "done") return "bg-green-500";
    if(status === "missed") return "bg-red-400";

    return "bg-gray-300";
  }

       
  const getContent = (habitId, day) => {   
    const key = `${habitId}-${day}`;       
    const status = progressMap[key];       

    if (status === "done") return "✔";     
    if (status === "missed") return "✖";   

    return "";                             
  };

  const isFuture = (day) =>{
    const today = new Date().getDate();
    return day > today;
  }

  return (
  <div className="p-6 bg-white max-w-screen mt-2">

    <div className="bg-white p-6 rounded-2xl shadow">

      {/* Top */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Habits</h1>

        <div className="text-sm text-gray-500">
          Total habits: {habits.length} 🔥 Current: 5
        </div>
      </div>

      {/* Streak */}
      <div className="mb-4 text-orange-500 font-medium">
        🔥 You’re on a 5 day streak!
      </div>

      {/* Add */}
      <div className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New habit..."
          className="border p-2 rounded-lg w-56 outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Header Row */}
      <div className="flex items-center mb-3">

        {/* Habit label (smaller width) */}
        <div className="w-32 text--500 font-medium mr-3">
          Habit
        </div>

        {/* Dates */}
        <div className="flex gap-1.5 text-xs text-gray-800">
          {[...Array(31)].map((_, i) => (
            <div key={i} className="w-6 text-center">
              {i + 1}
            </div>
          ))}
        </div>

      </div>

      {/* Habit Rows */}
      {habits.map((habit) => (
        <div key={habit._id} className="flex gap-2  items-center mb-2">

          {/* Habit Info */}
          <div className="w-32 flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">

            <div className="w-5 h-5 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-xs">
              ✔
            </div>

            <span className="text-sm truncate">
              {habit.title}
            </span>

            <button
              onClick={() => handleDelete(habit._id)}
              className="ml-auto bg-red-200 w-5 h-5 rounded text-sm"
            >
              <span className="text-red-600 font-bold">X</span>
            </button>

          </div>

          {/* Boxes */}
          <div className="flex gap-1.5 ml-1">

            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const key = `${habit._id}-${day}`;
              const status = progressMap[key];

              let bg = "bg-gray-200";

              if (status === "done") bg = "bg-green-400";
              else if (status === "missed") bg = "bg-orange-300";

              return (
                <div
                  key={i}
                  onClick={() => !isFuture(day) && handleClick(habit._id, day)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold cursor-pointer ${bg}`}
                >
                  {isFuture(day)
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

        </div>
      ))}

    </div>

  </div>
);
}