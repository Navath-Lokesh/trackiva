const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getDashboardStats, getHabitStats, getHeatmapData } = require("../controllers/analyticsController");

router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/habits", authMiddleware,getHabitStats);
router.get("/heatmap", authMiddleware, getHeatmapData);

module.exports = router;