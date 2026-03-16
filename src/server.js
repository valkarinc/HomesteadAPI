require("dotenv").config();

const express = require("express");
const seasonRoutes = require("./routes/seasonRoutes");
const playerRoutes = require("./routes/playerRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const initDb = require("./config/initDb");

const app = express();
const PORT = 3000;

app.use(express.json());
initDb();

app.get("/", (req, res) => {
  res.send("HomesteadAPI is running.");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "HomesteadAPI",
    time: new Date()
  });
});

app.use("/api/seasons", seasonRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});