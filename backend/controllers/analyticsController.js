const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

exports.getDashboardStats = async (req, res) => {

  try {

    const userId = req.user.id;

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // total habits
    const habits = await Habit.find({ userId });
    const totalHabits = habits.length;

    // today progress
    const todayProgress = await Progress.find({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const completedToday = todayProgress.filter(p => p.status === "done").length;

    const todayPercentage =
      totalHabits === 0
        ? 0
        : Math.round((completedToday / totalHabits) * 100);

    // 🔥 STREAK
    let streak = 0;

    for(let i = 0; i < 30; i++){

      const dayStart = new Date(today);
      dayStart.setDate(today.getDate() - i);

      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayProgress = await Progress.find({
        userId,
        date: { $gte: dayStart, $lt: dayEnd }
      });

      const doneCount = dayProgress.filter(p => p.status === "done").length;

      if(doneCount === totalHabits && totalHabits > 0){
        streak++;
      } else {
        break;
      }
    }

    // 📈 WEEKLY
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6);

    const weeklyProgress = await Progress.find({
      userId,
      date: { $gte: startOfWeek, $lt: tomorrow }
    });

    const weeklyCompleted = weeklyProgress.filter(p => p.status === "done").length;
    const weeklyTotal = totalHabits * 7;

    const weeklyPercentage =
      weeklyTotal === 0
        ? 0
        : Math.round((weeklyCompleted / weeklyTotal) * 100);

    // 📅 MONTHLY
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyProgress = await Progress.find({
      userId,
      date: { $gte: startOfMonth, $lt: tomorrow }
    });

    const monthlyCompleted = monthlyProgress.filter(p => p.status === "done").length;

    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const monthlyTotal = totalHabits * daysInMonth;

    const monthlyPercentage =
      monthlyTotal === 0
        ? 0
        : Math.round((monthlyCompleted / monthlyTotal) * 100);

    // ✅ FINAL RESPONSE
    res.json({
      totalHabits,
      completedToday,
      todayPercentage,
      streak,
      weeklyPercentage,
      monthlyPercentage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};


exports.getHabitStats = async (req, res) => {

  try {

    const userId = req.user.id;

    const habits = await require("../models/Habit").find({ userId });

    const progress = await require("../models/Progress").find({ userId });

    const result = habits.map(habit => {

      const habitProgress = progress.filter(
        p => p.habitId.toString() === habit._id.toString()
      );

      const totalDays = habitProgress.length;

      const completedDays = habitProgress.filter(
        p => p.status === "done"
      ).length;

      const percentage =
        totalDays === 0
          ? 0
          : Math.round((completedDays / totalDays) * 100);

      return {
        habitId: habit._id,
        title: habit.title,
        percentage
      };

    });

    res.json(result);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.getHeatmapData = async (req, res) => {

  try {

    const userId = req.user.id;

    const progress = await require("../models/Progress").find({ userId });

    const heatmap = {};

    progress.forEach(p => {

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

    res.status(500).json({ message: "Server error" });

  }

};