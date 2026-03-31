const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

// ================= DASHBOARD =================
exports.getDashboardStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today.getTime() + 86400000);

    const habits = await Habit.find({ userId });
    const totalHabits = habits.length;

    // ================= TODAY =================
    const todayProgress = await Progress.find({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const completedToday = todayProgress.filter(p => p.status === "done").length;

    const todayPercentage =
      totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

    // ================= 🔴 WEEKLY (ADDED) =================
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6); // last 7 days

    const weeklyProgress = await Progress.find({
      userId,
      date: { $gte: weekStart, $lt: tomorrow }
    });

    const weeklyDone = weeklyProgress.filter(p => p.status === "done").length;

    const weeklyTotal = totalHabits * 7;

    const weeklyPercentage =
      weeklyTotal === 0 ? 0 : Math.round((weeklyDone / weeklyTotal) * 100);

    // ================= 🔴 MONTHLY (ADDED) =================
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyProgress = await Progress.find({
      userId,
      date: { $gte: monthStart, $lt: tomorrow }
    });

    const daysInMonth = today.getDate(); // till today

    const monthlyDone = monthlyProgress.filter(p => p.status === "done").length;

    const monthlyTotal = totalHabits * daysInMonth;

    const monthlyPercentage =
      monthlyTotal === 0 ? 0 : Math.round((monthlyDone / monthlyTotal) * 100);

    // ================= STREAK =================
    let streak = 0;

    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() - i);

      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const dayProgress = await Progress.find({
        userId,
        date: { $gte: dayStart, $lt: dayEnd }
      });

      const doneCount = dayProgress.filter(p => p.status === "done").length;

      if (doneCount === totalHabits && totalHabits > 0) {
        streak++;
      } else {
        break;
      }
    }

    // ================= 🔴 HABIT STATS (FIX MISSING) =================
const allProgress = await Progress.find({ userId });

const statsMap = {};

allProgress.forEach(p => {
  const habitId = p.habitId?.toString();
  if (!habitId) return;

  if (!statsMap[habitId]) {
    statsMap[habitId] = { total: 0, done: 0 };
  }

  statsMap[habitId].total++;

  if (p.status === "done") {
    statsMap[habitId].done++;
  }
});

const habitStats = habits.map(habit => {
  const stat = statsMap[habit._id.toString()] || { total: 0, done: 0 };

  const percentage =
    stat.total === 0
      ? 0
      : Math.round((stat.done / stat.total) * 100);

  return {
    habitId: habit._id,
    title: habit.title,
    percentage
  };
});
    // ================= FINAL RESPONSE =================
    res.json({
      totalHabits,
      completedToday,
      todayPercentage,
      weeklyPercentage,   // 🔴 ADDED
      monthlyPercentage,  // 🔴 ADDED
      streak,
      habitStats
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= HABIT STATS =================
exports.getHabitStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const habits = await Habit.find({ userId });
    const progress = await Progress.find({ userId });

    const statsMap = {};

    progress.forEach(p => {
      const habitId = p.habitId?.toString();
      if (!habitId) return;

      if (!statsMap[habitId]) {
        statsMap[habitId] = { total: 0, done: 0 };
      }

      statsMap[habitId].total++;

      if (p.status === "done") {
        statsMap[habitId].done++;
      }
    });

    const result = habits.map(habit => {
      const stat = statsMap[habit._id.toString()] || { total: 0, done: 0 };

      const percentage =
        stat.total === 0
          ? 0
          : Math.round((stat.done / stat.total) * 100);

      return {
        habitId: habit._id,
        title: habit.title,
        percentage
      };
    });

    res.json(result);

  } catch (error) {
    console.error("Habit Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= HEATMAP =================
exports.getHeatmapData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const progress = await Progress.find({ userId });

    const heatmap = {};

    progress.forEach(p => {
      if (!p.date) return;

      const date = new Date(p.date).toISOString().split("T")[0];

      if (!heatmap[date]) {
        heatmap[date] = 0;
      }

      if (p.status === "done") {
        heatmap[date]++;
      }
    });

    const result = Object.keys(heatmap).map(date => ({
      date,
      count: heatmap[date]
    }));

    res.json(result);

  } catch (error) {
    console.error("Heatmap Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};