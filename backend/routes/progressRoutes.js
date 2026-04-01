const express = require("express");
const router = express.Router();

const{ markHabit, getMonthlyProgress,getHabitMatrix } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/mark",authMiddleware, markHabit);
router.get("/month", authMiddleware,getMonthlyProgress);
router.get("/matrix", authMiddleware, getHabitMatrix);

module.exports = router;