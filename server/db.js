"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("./config");

// Ensure data directory exists
const resolvedDbPath = path.isAbsolute(config.DB_PATH)
	? config.DB_PATH
	: path.join(__dirname, "..", config.DB_PATH);
const dataDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

// Open database connection
const db = new Database(resolvedDbPath);

// Initialize schema
db.pragma("journal_mode = WAL");
db.exec(
	"CREATE TABLE IF NOT EXISTS conferences (\n" +
		"  id TEXT PRIMARY KEY,\n" +
		"  telegram_user_id TEXT NOT NULL,\n" +
		"  created_at TEXT NOT NULL,\n" +
		"  metadata TEXT NULL\n" +
		");"
);

module.exports = db;


