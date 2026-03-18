const DailyProgress = require("../models/Progress");
const Habit = require("../models/Habit");
const Progress = require("../models/Progress");


exports.markHabit = async (req, res) => {

  try {

    const { habitId, date, status } = req.body;

    const existing = await DailyProgress.findOne({
      habitId,
      userId: req.user.id,
      date
    });

    if (existing) {

      existing.status = status;
      await existing.save();

      return res.json({
        message: "Habit updated",
        progress: existing
      });

    }

    const progress = new DailyProgress({
      habitId,
      userId: req.user.id,
      date,
      status
    });

    await progress.save();

    res.status(201).json({
      message: "Habit marked",
      progress
    });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.getMontlyProgress = async (req, res) =>{
    try{
        const{ month, year } = req.query;

        const startDate = new Date(year, month-1,1);
        const endDate = new Date(year, month,0);

        const progress = await DailyProgress.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        });
        res.json(progress);
    } catch(error){
        res.status(500).json({ message: "server error" });
    }
};


exports.getHabitMatrix = async (req, res) => {

  try {

    const userId = req.user.id;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const habits = await Habit.find({ userId });

    const progress = await Progress.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const matrix = habits.map(habit => {

      const dates = {};

      progress.forEach(p => {
        if (p.habitId.toString() === habit._id.toString()) {
          const day = new Date(p.date).getDate();
          dates[day] = p.status;
        }
      });

      return {
        habitId: habit._id,
        title: habit.title,
        dates
      };

    });

    res.json(matrix);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};