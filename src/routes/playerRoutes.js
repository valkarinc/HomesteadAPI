const express = require("express");
const router = express.Router();
const {
  registerPlayer,
  getPlayerBySteamId
} = require("../services/playerService");

router.get("/test", (req, res) => {
  res.json({
    message: "Player route working"
  });
});

router.get("/all", (req, res) => {
  const db = require("../config/db");

  db.all("SELECT * FROM players", [], (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
      return;
    }

    res.json({
      success: true,
      players: rows
    });
  });
});

router.get("/:steamId", async (req, res) => {
  try {
    const { steamId } = req.params;

    const player = await getPlayerBySteamId(steamId);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    res.json({
      success: true,
      player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

router.post("/register", async (req, res) => {

  try {

    const { steamId, playerName } = req.body;

    const result = await registerPlayer({
      steamId,
      playerName
    });

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