const db = require("../config/db");

function registerPlayer(playerData) {
  return new Promise((resolve, reject) => {
    const { steamId, playerName } = playerData;

    const query = `
      INSERT INTO players (steam_id, player_name)
      VALUES (?, ?)
    `;

    db.run(query, [steamId, playerName], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          resolve({
            success: true,
            message: "Player already registered",
            player: {
              steamId,
              playerName
            }
          });
          return;
        }

        reject(err);
        return;
      }

      resolve({
        success: true,
        message: "Player registered successfully",
        player: {
          id: this.lastID,
          steamId,
          playerName
        }
      });
    });
  });
}

function getPlayerBySteamId(steamId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM players
      WHERE steam_id = ?
    `;

    db.get(query, [steamId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row || null);
    });
  });
}

function updatePlayerLoginStreak(steamId, lastLoginDate, loginStreak) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE players
      SET last_login_date = ?, login_streak = ?
      WHERE steam_id = ?
    `;

    db.run(query, [lastLoginDate, loginStreak, steamId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        success: true,
        steamId,
        lastLoginDate,
        loginStreak
      });
    });
  });
}

module.exports = {
  registerPlayer,
  getPlayerBySteamId,
  updatePlayerLoginStreak
};