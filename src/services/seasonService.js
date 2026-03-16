const SEASON_CONFIG = require("../config/seasons");

function getCurrentSeason() {
  const startDate = new Date(SEASON_CONFIG.seasonOneStartDate);
  const now = new Date();

  if (now < startDate) {
    return {
      seasonNumber: 0,
      seasonName: "Pre-Season",
      seasonLengthMonths: SEASON_CONFIG.seasonLengthMonths,
      seasonOneStartDate: SEASON_CONFIG.seasonOneStartDate
    };
  }

  const diffMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  const seasonNumber =
    Math.floor(diffMonths / SEASON_CONFIG.seasonLengthMonths) + 1;

  return {
    seasonNumber: seasonNumber,
    seasonName: `Season ${seasonNumber}`,
    seasonLengthMonths: SEASON_CONFIG.seasonLengthMonths,
    seasonOneStartDate: SEASON_CONFIG.seasonOneStartDate
  };
}

module.exports = {
  getCurrentSeason
};