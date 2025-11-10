# Ahey (previously Hello)

## A free, p2p, group video call app for the web. No signups. No downloads. Works in all major browsers.

Ahey is built on WebRTC, enabling peer-to-peer video, audio, and text communication. Group calls use a mesh topology, where each participant connects directly to every other participant. This means there’s no central server handling the media streams, which keeps things private and low-latency, but also makes performance dependent on the number of participants and their internet speeds. Call quality tends to decrease as more people join, with the sweet spot typically being around 6 to 8 participants on a high-speed connection.

### Key Features

- **No Sign-up Required:** Join or create video calls instantly without accounts or passwords.
- **Peer-to-Peer WebRTC:** Low-latency direct streaming between participants.
- **Unique Channel URLs:** Easily shareable links like `ahey.io/channel-id`.
 - **Telegram-bot controlled rooms (optional):** When enabled, only IDs created via a bot API can be joined.
- **Embed Anywhere:** Embed calls on any website or app using an `<iframe>`.
- **Free and Browser-Based:** 100% free, runs in modern browsers with no downloads.

---

### Wiki

Please refer [wiki page](https://github.com/vasanthv/ahey/wiki) for more documentation.

### Contributions

Please refer <a href="https://github.com/vasanthv/ahey/blob/master/markdowns/CONTRIBUTIONS.md">CONTRIBUTIONS.md</a> for more info.

### LICENSE

<a href="https://github.com/vasanthv/ahey/blob/master/LICENSE">MIT License</a>

---

## Telegram-only Conference Creation

When enabled, conferences can be created only by your Telegram bot via a protected API. Users can join only if the ID exists in the database.

### Env Vars

- `BOT_API_SECRET` – shared secret for the bot. Required.
- `DB_PATH` – path to SQLite DB (default `./data/ahey.db`).

### API

`POST /api/createConference`

Headers:

- `X-Bot-Secret: <BOT_API_SECRET>`

Body JSON:

```json
{ "telegramUserId": "123456789", "metadata": { "note": "optional" } }
```

Response `201`:

```json
{ "id": "<generated>", "url": "https://host/<generated>" }
```

If the header is missing or invalid, returns `401`.

### Notes

- Web UI no longer generates random IDs; users must enter an ID created by the bot.
- Visiting `/<id>` works only if the `id` exists in the `conferences` table.
