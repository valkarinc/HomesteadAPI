const express = require("express");
const router = express.Router();
const { getCurrentSeason } = require("../services/seasonService");

router.get("/current", (req, res) => {
  const currentSeason = getCurrentSeason();

  res.json(currentSeason);
});

module.exports = router;