const cron = require("node-cron");

const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

cron.schedule("5 0 * * *", async () => {
  console.log("Running auto-miss job...");

  try {

    const users = await require("../models/User").find();

    const today = new Date();
    today.setHours(0,0,0,0);

    for (const user of users) {

      const habits = await Habit.find({ userId: user._id });

      for (const habit of habits) {

        const existing = await Progress.findOne({
          habitId: habit._id,
          userId: user._id,
          date: today
        });

        //  If not marked → mark as MISSED
        if (!existing) {

          await Progress.create({
            habitId: habit._id,
            userId: user._id,
            date: today,
            status: "missed"
          });

        }

      }

    }

  } catch (error) {
    console.log("Auto miss error:", error);
  }

});