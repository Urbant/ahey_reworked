"use strict";

const crypto = require("crypto");
const db = require("../db");
const config = require("../config");
const { isValidChannelName } = require("../utils");

const selectByIdStmt = db.prepare("SELECT id, telegram_user_id, created_at, metadata FROM conferences WHERE id = ?");
const insertStmt = db.prepare(
	"INSERT INTO conferences (id, telegram_user_id, created_at, metadata) VALUES (@id, @telegram_user_id, @created_at, @metadata)"
);

function getConferenceById(id) {
	const row = selectByIdStmt.get(id);
	if (!row) return null;

	if (config.CONFERENCE_TTL_MINUTES !== null) {
		const createdAt = new Date(row.created_at).getTime();
		const expiresAt = createdAt + config.CONFERENCE_TTL_MINUTES * 60 * 1000;
		if (Date.now() > expiresAt) return null;
	}

	return {
		id: row.id,
		telegramUserId: row.telegram_user_id,
		createdAt: row.created_at,
		metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
	};
}

function generateId() {
	return crypto.randomBytes(6).toString("hex"); // 12 hex chars
}

function createConference({ telegramUserId, metadata }) {
	if (!telegramUserId || typeof telegramUserId !== "string") {
		throw new Error("telegramUserId is required");
	}

	let id;
	let attempts = 0;
	do {
		id = generateId();
		attempts++;
		if (attempts > 5) throw new Error("Failed to generate unique id");
	} while (!isValidChannelName(id) || getConferenceById(id));

	const created_at = new Date().toISOString();
	const payload = {
		id,
		telegram_user_id: telegramUserId,
		created_at,
		metadata: metadata ? JSON.stringify(metadata) : null,
	};

	insertStmt.run(payload);

	return { id, createdAt: created_at };
}

module.exports = { createConference, getConferenceById };
