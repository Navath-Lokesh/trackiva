const express = require("express");
const router = express.Router();

const{ markHabit, getMontlyProgress,getHabitMatrix } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/mark",authMiddleware, markHabit);
router.get("/month", authMiddleware,getMontlyProgress);
router.get("/matrix", authMiddleware, getHabitMatrix);

module.exports = router;