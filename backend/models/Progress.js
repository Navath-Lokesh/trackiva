const mongoose = require("mongoose");

const dailyProgressSchema = new mongoose.Schema({

  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["done", "missed"],
    required: true
  },

  note: {
    type: String
  }

});

dailyProgressSchema.index({ userId: 1, habitId: 1, date: 1 });

module.exports =
  mongoose.models.DailyProgress ||
  mongoose.model("DailyProgress", dailyProgressSchema);