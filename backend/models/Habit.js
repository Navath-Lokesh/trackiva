const mongoose = required("mongoose");

const habitSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.Object,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Habit", habitSchema);