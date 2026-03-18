const cron = require("node-cron");

const User = require("../models/User");
const Habit = require("../models/Habit");
const Progress = require("../models/Progress");
const sendEmail = require("../cron/sendEmail");

cron.schedule("0 20 * * *", async () => {
  console.log("Running reminder email job...");

  try {

    const users = await User.find();

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    for(const user of users){

      const habits = await Habit.find({ userId: user._id });

      if(habits.length === 0) continue;

      let incompleteHabits = [];

      for(const habit of habits){

        const progress = await Progress.findOne({
          habitId: habit._id,
          userId: user._id,
          date: { $gte: today, $lt: tomorrow }
        });

        if(!progress || progress.status !== "done"){
          incompleteHabits.push(habit.title);
        }

      }

      if(incompleteHabits.length > 0){

        const subject = "Trackiva Reminder";

        const html = `
        <h2>Don't break your streak 🔥</h2>
        <p>You still have incomplete habits today:</p>
        <ul>
          ${incompleteHabits.map(h => `<li>${h}</li>`).join("")}
        </ul>
        <p>Open Trackiva and complete them today!</p>
        `;

        await sendEmail(user.email, subject, html);

      }

    }

  } catch (error) {
    console.log("Reminder cron error:", error);
  }

});