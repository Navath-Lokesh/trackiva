const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

// ================= CREATE HABIT =================
exports.createHabit = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const habit = new Habit({
      title: title.trim(),
      userId: req.user.id
    });

    await habit.save();

    res.status(201).json({
      message: "Habit created",
      habit
    });

  } catch (error) {
    console.error("Create Habit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET HABITS =================
exports.getHabits = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json(habits);

  } catch (error) {
    console.error("Get Habits Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE HABIT =================
exports.deleteHabit = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);

    // ❌ Habit not found
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // ❌ Unauthorized delete protection
    if (habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Habit.findByIdAndDelete(habitId);

    // delete related progress
    await Progress.deleteMany({ habitId });

    res.json({ message: "Habit deleted successfully" });

  } catch (error) {
    console.error("Delete Habit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};