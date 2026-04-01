// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const progressRoutes = require("./routes/progressRoutes");
// const habitRoutes = require("./routes/habitRoutes")
// const analyticsRoutes = require("./routes/analyticsRoutes");
// const chatRoutes = require("./routes/chatRoutes");


// require("./cron/autoMiss");
// require("./cron/reminderEmail");


// dotenv.config();


// connectDB();

// const app = express();
// app.set("trust proxy", 1);

// // app.use(cors());


// app.use(cors({
//   origin: process.env.CLIENT_URL || "*",
//   credentials: true
// }));

// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/habits", habitRoutes);
// app.use("/api/progress", progressRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/chat", chatRoutes);


// app.get("/", (req, res) => {
//   res.send("Trackiva API Running...");
// });


// app.use((err, req, res, next) =>{
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Something went Wrong"
//   });
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const habitRoutes = require("./routes/habitRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const chatRoutes = require("./routes/chatRoutes");

// cron jobs
require("./cron/autoMiss");
require("./cron/reminderEmail");

// load env variables
dotenv.config();

// connect to database
connectDB();

const app = express();

// trust proxy (important for render)
app.set("trust proxy", 1);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// middleware
app.use(express.json());

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Trackiva API Running...");
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went Wrong"
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});