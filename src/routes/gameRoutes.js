const express = require("express");
const router = express.Router();

const gameAuth = require("../middleware/gameAuth");
const { registerPlayer } = require("../services/playerService");
const { claimDailyReward } = require("../services/rewardService");

router.post("/login", gameAuth, async (req, res) => {
  try {

    const { steamId, playerName } = req.body;

    if (!steamId || !playerName) {
      return res.status(400).json({
        success: false,
        message: "steamId and playerName are required"
      });
    }

    // register player if not already registered
    await registerPlayer({
      steamId,
      playerName
    });

    // claim daily reward
    const rewardResult = await claimDailyReward(steamId);

    res.json({
      success: true,
      steamId,
      playerName,
      reward: rewardResult
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });

  }
});

module.exports = router;