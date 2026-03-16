const db = require("./db");

function initDb() {
  db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steam_id TEXT NOT NULL UNIQUE,
        player_name TEXT NOT NULL,
        last_login_date TEXT,
        login_streak INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        db.run(`
      CREATE TABLE IF NOT EXISTS reward_claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        steam_id TEXT NOT NULL,
        reward_date TEXT NOT NULL,
        reward_type TEXT NOT NULL,
        season_number INTEGER NOT NULL,
        season_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(steam_id, reward_date, reward_type)
      )
    `);
        db.run(`
      CREATE TABLE IF NOT EXISTS reward_definitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reward_key TEXT NOT NULL UNIQUE,
        reward_name TEXT NOT NULL,
        reward_description TEXT,
        reward_type TEXT NOT NULL,
        reward_value TEXT NOT NULL,
        streak_day INTEGER,
        season_number INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

module.exports = initDb;