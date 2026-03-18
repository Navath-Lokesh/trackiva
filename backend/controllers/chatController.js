const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

exports.chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get user stats
    const habits = await Habit.find({ userId });
    const totalHabits = habits.length;

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today.getTime() + 86400000);

    const todayProgress = await Progress.find({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const completedToday = todayProgress.filter(p => p.status === "done").length;

    const todayPercentage =
      totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

    // Build smart reply (for now rule-based)
    let reply = "";

    if (todayPercentage === 100) {
      reply = `Amazing 🔥 You completed all your habits today. Keep this streak going!`;
    }
    else if (todayPercentage >= 50) {
      reply = `Good job 👍 You completed ${todayPercentage}% of your habits. Try to push a bit more tomorrow.`;
    }
    else {
      reply = `You completed only ${todayPercentage}% today. Don't worry — reset and come back stronger tomorrow 💪`;
    }

    // Add user message context
    if (message.toLowerCase().includes("motivation")) {
      reply += " Remember: discipline beats motivation.";
    }

    res.json({ reply });

  } catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
}

};