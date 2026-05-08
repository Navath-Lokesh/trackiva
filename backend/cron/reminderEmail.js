const cron = require("node-cron");

const User = require("../models/User");
const Habit = require("../models/Habit");
const Progress = require("../models/Progress");
const sendEmail = require("../utils/sendEmail");

// 🔥  RUN ONCE EVERY DAY AT 8 PM
cron.schedule("0 20 * * *", async () => {
  console.log("⏰ Running reminder email job...");

  try {
    const users = await User.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    for (const user of users) {
      console.log("👤 Checking user:", user.email);

      if(user.lastReminderDate){
        const lastSent = new Date(user.lastReminderDate);
        lastSent.setHours(0,0,0,0);

        if(lastSent.getTime() === today.getTime()){
          console.log("Already sent reminder today");
          continue;
        }
      }

      const habits = await Habit.find({ userId: user._id });


      // ------------ User without habits --------------- //

        const day = new Date().getDay();
        // 1 = Monday
       // 4 = Thursday

    if (day !== 1 && day !== 4) {
    continue;
    }

      if (habits.length === 0) {

  const day = new Date().getDay();

  // Only Monday & Thursday
  if (day !== 1 && day !== 4) {
    continue;
  }

  const subject = "Start Your First Habit on Trackiva 🚀";

  const html = `
    <h2>Welcome to Trackiva 🚀</h2>

    <p>You created your account, but haven’t added any habits yet.</p>

    <p>Start with just ONE habit today 🔥</p>
  `;

  await sendEmail(user.email, subject, html);

  console.log("✅ Motivation email sent!");

  continue;
}

      let incompleteHabits = [];

      for (const habit of habits) {
        const progress = await Progress.findOne({
          habitId: habit._id,
          userId: user._id,
          date: { $gte: today, $lt: tomorrow },
        });

        if (!progress || progress.status !== "done") {
          incompleteHabits.push(habit.title);
        }
      }

      console.log("📊 Incomplete habits:", incompleteHabits);

      // 🔥 TEMPORARY TEST (FORCE EMAIL)
      if (incompleteHabits.length > 0) {
        const subject = "Trackiva Reminder";

        const html = `
          <h2>Don't break your streak 🔥</h2>
          <p>You still have incomplete habits today:</p>
          <ul>
            ${incompleteHabits.map((h) => `<li>${h}</li>`).join("")}
          </ul>
          <p>Open Trackiva and complete them today!</p>
        `;

        console.log("📧 Sending email to:", user.email);

        // ✅ FIXED sendEmail format
        await sendEmail(user.email, subject, html);

await User.findByIdAndUpdate(user._id, {
  lastReminderDate: new Date(),
});

console.log("✅ Email sent successfully!");

        console.log("✅ Email sent successfully!");
      } else {
        console.log("✅ All habits completed. No email sent.");
      }
    }
  } catch (error) {
    console.log("❌ Reminder cron error:", error);
  }
}, {
  timezone: "Asia/Kolkata", // ✅ IMPORTANT
});






// const cron = require("node-cron");

// const User = require("../models/User");
// const Habit = require("../models/Habit");
// const Progress = require("../models/Progress");
// const sendEmail = require("../utils/sendEmail");

// // 🔥 RUN ONCE EVERY DAY AT 8 PM
// cron.schedule("35 19 * * *", async () => {
//   console.log("⏰ Running reminder email job...");

//   try {
//     const users = await User.find();

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

//     for (const user of users) {
//       console.log("👤 Checking user:", user.email);

//       // 🔥 ADDED: Prevent duplicate emails
//       if (
//         user.lastReminderDate &&
//         new Date(user.lastReminderDate).toDateString() === today.toDateString()
//       ) {
//         console.log("⏭️ Already sent reminder today");
//         continue;
//       }

//       const habits = await Habit.find({ userId: user._id });

//       if (habits.length === 0) {
//         console.log("⚠️ No habits found for user");
//         continue;
//       }

//       let incompleteHabits = [];

//       for (const habit of habits) {
//         const progress = await Progress.findOne({
//           habitId: habit._id,
//           userId: user._id,
//           date: { $gte: today, $lt: tomorrow },
//         });

//         if (!progress || progress.status !== "done") {
//           incompleteHabits.push(habit.title);
//         }
//       }

//       console.log("📊 Incomplete habits:", incompleteHabits);

//       if (incompleteHabits.length > 0) {
//         const subject = "🔥 Trackiva Reminder - Don't break your streak!";

//         const html = `
//           <h2>🔥 Don't break your streak!</h2>
//           <p>You still have incomplete habits today:</p>
//           <ul>
//             ${incompleteHabits.map((h) => `<li>${h}</li>`).join("")}
//           </ul>
//           <p>👉 Open Trackiva and complete them now!</p>
//         `;

//         console.log("📧 Sending email to:", user.email);

//         await sendEmail(user.email, subject, html);

//         // 🔥 CRITICAL: Save reminder date
//         user.lastReminderDate = new Date();
//         await user.save();

//         console.log("✅ Email sent successfully!");
//       } else {
//         console.log("✅ All habits completed. No email sent.");
//       }
//     }

//   } catch (error) {
//     console.log("❌ Reminder cron error:", error);
//   }

// }, {
//   timezone: "Asia/Kolkata"
// });