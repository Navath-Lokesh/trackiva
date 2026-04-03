const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    creatdHabit,
    getHabits,
    deleteHabit,
    createHabit
} = require("../controllers/habitController");
 router.post("/",authMiddleware,createHabit);   
 router.get("/",authMiddleware, getHabits);
 router.delete("/:id", authMiddleware, deleteHabit);
 
 module.exports = router;