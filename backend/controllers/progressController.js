const mongoose = require("mongoose");
const DailyProgress = require("../models/Progress");
const Habit = require("../models/Habit");

// ================= MARK HABIT =================
exports.markHabit = async (req, res) => {
  try {
    const { habitId, date, status } = req.body;

    if (!habitId || !date || !status) {
      return res.status(400).json({
        message: "habitId, date and status are required"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    // ❌ Future date restriction
    if (inputDate > today) {
      return res.status(400).json({
        message: "You cannot mark habits for future dates"
      });
    }

    // 🔥 Check habit exists
    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // 🔥 Check ownership
    if (habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const progress = await DailyProgress.findOneAndUpdate(
      {
        habitId: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(req.user.id),
        date: inputDate
      },
      {
        $set: { status }
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: "Habit marked/updated",
      progress
    });

  } catch (error) {
    console.error("Mark Habit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET MONTHLY PROGRESS =================
exports.getMontlyProgress = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required"
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const progress = await DailyProgress.find({
      userId: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json(progress);

  } catch (error) {
    console.error("Monthly Progress Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ================= GET HABIT MATRIX =================
exports.getHabitMatrix = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required"
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 🔥 Get habits
    const habits = await Habit.find({ userId });

    // 🔥 FIXED: use DailyProgress instead of Progress
    const progress = await DailyProgress.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // GROUP PROGRESS BY HABIT
    const progressMap = {};

    progress.forEach(p => {
      const habitId = p.habitId.toString();

      if (!progressMap[habitId]) {
        progressMap[habitId] = {};
      }

      const day = new Date(p.date).getDate();
      progressMap[habitId][day] = p.status;
    });

    // BUILD MATRIX
    const matrix = habits.map(habit => ({
      habitId: habit._id,
      title: habit.title,
      dates: progressMap[habit._id.toString()] || {}
    }));

    res.json(matrix);

  } catch (error) {
    console.error("Habit Matrix Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};