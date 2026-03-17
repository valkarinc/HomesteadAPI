const db = require("../config/db");
const { getCurrentSeason } = require("./seasonService");
const {
  getPlayerBySteamId,
  updatePlayerLoginStreak
} = require("./playerService");

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}

async function claimDailyReward(steamId) {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();
  const rewardType = "daily_login";
  const currentSeason = getCurrentSeason();

  const player = await getPlayerBySteamId(steamId);

  if (!player) {
    return {
      success: false,
      message: "Player not found"
    };
  }

  let newStreak = 1;

  if (player.last_login_date === today) {
    newStreak = player.login_streak || 1;
  } else if (player.last_login_date === yesterday) {
    newStreak = (player.login_streak || 0) + 1;
  }

  await updatePlayerLoginStreak(steamId, today, newStreak);

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO reward_claims (
        steam_id,
        reward_date,
        reward_type,
        season_number,
        season_name
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        steamId,
        today,
        rewardType,
        currentSeason.seasonNumber,
        currentSeason.seasonName
      ],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            resolve({
              success: true,
              message: "Daily reward already claimed",
              steamId,
              rewardDate: today,
              rewardType,
              seasonNumber: currentSeason.seasonNumber,
              seasonName: currentSeason.seasonName,
              loginStreak: newStreak
            });
            return;
          }

          reject(err);
          return;
        }

        resolve({
          success: true,
          message: "Daily reward claimed successfully",
          claimId: this.lastID,
          steamId,
          rewardDate: today,
          rewardType,
          seasonNumber: currentSeason.seasonNumber,
          seasonName: currentSeason.seasonName,
          loginStreak: newStreak
        });
      }
    );
  });
}

module.exports = {
  claimDailyReward
};