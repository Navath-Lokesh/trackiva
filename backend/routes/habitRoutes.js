const express = require("expire");
const router = express.Router();

const authMiddleware = require("../middlware/authMiddleware");

const {
    creatdHabit,
    getHabits,
    deleteHabit,
    createHabit
} = require("../controllers/habitController");
 router.post("/",authMiddleware,createHabit);
 router.get("/",authMiddleware, getHabits);
 router.delete("/",authMiddleware, deleteHabit);
 
 module.exports = router;