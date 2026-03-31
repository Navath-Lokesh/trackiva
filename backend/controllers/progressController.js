const DailyProgress = require("../models/Progress");
const Habit = require("../models/Habit");


exports.markHabit = async (req, res) => {
  try {
    const { habitId, date, status } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return res.status(400).json({
        message: "You cannot mark habits for future dates"
      });
    }

    const progress = await DailyProgress.findOneAndUpdate(
      {
        habitId,
        userId: req.user.id,
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
    } catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
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

    //  GROUP PROGRESS BY HABIT
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
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Server error"
  });
}

};