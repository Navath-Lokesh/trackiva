const express = require("express");
const router = express.Router();

const{ markHabit, getMontlyProgress } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/mark",authMiddleware, markHabit);
router.get("/month", authMiddleware,getMontlyProgress)

module.exports = router;