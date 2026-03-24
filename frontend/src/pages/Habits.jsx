import { useEffect, useState } from "react";
import { createHabit, getHabits } from "../api/habitApi";
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
    <div className="p-6">

        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Trackiva</h1>

            <div className="text-sm text-gray-600">
                Total habits: { Array.isArray(habits) ? habits.length: 0}
            </div>
        </div>

      {/* <h1 className="text-2xl font-bold mb-4">Habits</h1> */}
      <div className="mt-6 text-lg font-semibold text-orange-500">
        🔥 You're on a {5} day streak!
      </div>

      {/* Add Habit */}
      <div className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New habit..."
          className="border p-2 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>
      </div>

      {/* Days Header */}
      <div className="flex gap-2 mb-2 ml-32">
        {[...Array(31)].map((_, i) => (
          <div key={i} className="w-8 text-center text-sm">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Habit Rows */}
      {Array.isArray(habits) && habits.map((habit) => (
        <div key={habit._id} className="flex items-center gap-2 mb-2">

          {/* Habit Name */}
          <div className="w-32 flex items-center gap-2 bg-white p-2 rounded shadow">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white">
                ✔
            </div>
            {habit.title}
          </div>

          {/* Day Boxes */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1; 

            return (
              <div
                key={i}
                onClick={() => !isFuture(day) && handleClick(habit._id, day)}
                
                className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded 
                  ${isFuture(day) ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"} 
                  ${!isFuture(day) ? getColor(habit._id, day) : ""}`}                
              >
                
                {isFuture(day) ? "🔒" : getContent(habit._id, day)}
              </div>
            );
          })}

        </div>
      ))}

    </div>
  );
}