"use strict";

const config = require("../config");

function botAuth(req, res, next) {
	const header = req.get("X-Bot-Secret");
	if (!config.BOT_API_SECRET || header !== config.BOT_API_SECRET) {
		return res.status(401).json({ error: "unauthorized" });
	}
	return next();
}

module.exports = botAuth;


