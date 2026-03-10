const Habit = require("../models/Habit");
const DailyProgress = require("../models/DailyProgress");

exports.createHabit = async (req, res) => {

  try {

    const { title } = req.body;

    const habit = new Habit({
      title,
      userId: req.user.id
    });

    await habit.save();

    res.status(201).json({
      message: "Habit created",
      habit
    });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.getHabits = async (req, res) => {

  try {

    const habits = await Habit.find({ userId: req.user.id });

    res.json(habits);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.deleteHabit = async (req, res) => {

  try {

    const habitId = req.params.id;

    await Habit.findByIdAndDelete(habitId);

    await DailyProgress.deleteMany({ habitId });

    res.json({ message: "Habit deleted" });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};