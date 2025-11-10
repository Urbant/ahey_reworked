module.exports = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT ?? 824,
	CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:824"],
	BOT_API_SECRET: process.env.BOT_API_SECRET,
	DB_PATH: process.env.DB_PATH || "./data/ahey.db",
};
