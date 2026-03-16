const Habit = require("../models/Habit");
const Progress = require("../models/Progress");

exports.getDashboardStats = async (req, res) => {

  try {

    const userId = req.user.id;

    const today = new Date();

    const startOfToday = new Date(today.setHours(0,0,0,0));
    const endOfToday = new Date(today.setHours(23,59,59,999));

    const habits = await Habit.find({ userId });

    const totalHabits = habits.length;

    const todayProgress = await Progress.find({
      userId,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const completedToday = todayProgress.filter(p => p.status === "done").length;

    const todayPercentage =
      totalHabits === 0
        ? 0
        : Math.round((completedToday / totalHabits) * 100);

        // week percentage calculation
        const startofWeek = new Date();
        startofWeek.setDate(startofWeek.getDate9()-7);
        startofWeek.setHours(0,0,0,0);

        const weeklyProgress = await Progress.find({
          userId,
          date:{ $gte: startOfweek }
        })

        const weeklyCompleted = weeklyProgress.filter(p => p.status === "done").length;
        const weeklyTotal = totalHabits * 7;

        const weeklyPercentage = weeklyTotal === 0 ? 0 : Math.round((weeklyCompleted / weeklyTotal) * 100);


        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyProgress = await Progress.find({
          userId,
          date: { $gte: startOfMonth}
        });
        

        // monthly percentage calculation
        const monthlyCompleted = monthlyProgress.filter(p => p.status === "done").length;

        const daysInMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
        
        const monthlyTotal = totalHabits * daysInMonth;
        const monthLyPercentage = monthlyTotal === 0 ? 0 : Math.round((monthlyCompleted / monthlyTotal) * 100);
        
        // streak 
        let streak = 0;
        for(let i=0; i<365; i++){
          const date = new Date();
          date.setDate(date.getDate()-i);
          date.setHours(0,0,0,0);

          const nextDate = new Date(date);
          nextDate.setHours(23,59,59,999);

          const progress = await Progress.find({
            userId,
            date:{ $gte: date, $lte: nextDate }
          });

          const completed = progress.filter(p => p.status === "done").length;
          if(completed === totalHabits && totalHabits !==0){
            streak++;
          }else{
            break;
          }
        }

    res.json({
      totalHabits,
      completedToday,
      todayPercentage
    });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};