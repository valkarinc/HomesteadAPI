const express = require("express");
const router = express.Router();
const { claimDailyReward } = require("../services/rewardService");

router.get("/all", (req, res) => {
  const db = require("../config/db");

  db.all("SELECT * FROM reward_claims", [], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
      return;
    }

    res.json({
      success: true,
      rewards: rows
    });
  });
});

router.get("/:steamId", (req, res) => {
  const db = require("../config/db");
  const { steamId } = req.params;

  db.all(
    "SELECT * FROM reward_claims WHERE steam_id = ? ORDER BY created_at DESC",
    [steamId],
    (err, rows) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
        return;
      }

      res.json({
        success: true,
        steamId,
        rewards: rows
      });
    }
  );
});

router.post("/daily", async (req, res) => {
  try {
    const { steamId } = req.body;

        if (!steamId) {
      return res.status(400).json({
        success: false,
        message: "steamId is required"
      });
    }

    const result = await claimDailyReward(steamId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;