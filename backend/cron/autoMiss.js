const cron = require("node-cron");

const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

cron.schedule("58 23 * * *", async () =>{
    console.log("Running auto-miss jon...");

    const today = new Date();
    today.setHours(0,0,0,0);

    const habits = await Habit.find();

    for(const habit of habits){

        const existing = await Progress.findOne({
            habitId: habit._id,
            userId: habit.userId,
            date: today
        });
        
        if(!existing){
            await Progress.create({
                habitId: habit._id,
                userId: habit.userId,
                date: today,
                status: "missed"
            });
        }
    }
});