const DailyProgress = require("../models/Progress");

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