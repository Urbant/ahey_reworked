# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the development server (port 824)
npm start

# Lint
npx eslint .

# Format EJS templates
npm run format:ejs

# Build and run with Docker
npm run docker
# or with docker-compose (reads .env automatically)
docker-compose up --build
```

No tests are configured (`npm test` exits with error).

## Architecture

Ahey is a browser-based WebRTC video conferencing app. The server only handles signalling — all audio/video streams travel peer-to-peer. Group calls use a **full mesh topology**: every participant opens a direct RTCPeerConnection to every other participant.

### Server (`server/`)

| File | Role |
|------|------|
| `config.js` | Reads env vars; single source of truth for config |
| `db.js` | Opens a `better-sqlite3` connection, creates `conferences` table on startup |
| `routes.js` | Express routes: home `/`, channel `/:channel`, static pages, bot API |
| `signalling-server.js` | Socket.IO handler: tracks `channels`/`sockets`/`peers` in memory, relays `addPeer`, `removePeer`, `relayICECandidate`, `relaySessionDescription` events |
| `middleware/botAuth.js` | Validates `X-Bot-Secret` header against `BOT_API_SECRET` env var |
| `services/conferences.js` | SQLite CRUD — `createConference` and `getConferenceById` |
| `utils.js` | `isValidChannelName` — alphanumeric + hyphens, max 63 chars |

### Frontend (`public/`)

| File | Role |
|------|------|
| `app.js` | Vue 3 app (loaded via CDN from `node_modules/vue/dist/`), manages UI state: pre-call media preview, call controls, device selection, chat, screen share |
| `peer.js` | Vanilla JS WebRTC logic: `initiateCall()`, peer connection lifecycle, ICE/SDP relay, audio volume analysis for "is talking" detection |
| `ice-config.js` | `window.ICE_SERVERS` — STUN/TURN config; `// $TURN_SERVER` placeholder is replaced at production startup by `scripts/pre-start.js` |
| `sw.js` | Service worker for PWA; `~VERSION~` placeholder replaced at production startup |

### Views (`views/`)

EJS templates. `channel.ejs` is the call page; it loads `ice-config.js`, `peer.js`, and `app.js` in that order (globals dependency chain: `ICE_SERVERS` → `App` → `initiateCall`).

### Startup (`scripts/pre-start.js`)

Runs before `init.js` in production only. Injects TURN server credentials into `ice-config.js` and the package version into `sw.js`. **These are in-place file mutations** — running in production mode more than once will double-inject values.

## Environment Variables

| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `824` | HTTP listen port |
| `CORS_ORIGIN` | `http://localhost:824` | Comma-separated allowed origins for Socket.IO |
| `BOT_API_SECRET` | — | Enables Telegram-bot-only conference creation; if unset, the `POST /api/createConference` endpoint returns 401 for all requests |
| `DB_PATH` | `./data/ahey.db` | SQLite database file path |
| `TURN_URL_UDP` / `TURN_URL_TCP` | — | Custom TURN server URLs (production only) |
| `TURN_USERNAME` / `TURN_PASSWORD` | — | TURN credentials |

## Key Behaviours

- **Conference creation is gated by SQLite**: `/:channel` returns 400 if the channel ID does not exist in the `conferences` table. IDs can only be created via `POST /api/createConference` (requires `BOT_API_SECRET`).
- **No bundler**: Vue 3 is served directly from `node_modules/vue/dist/`. Frontend JS files are plain scripts loaded via `<script>` tags.
- **H.264 preference**: `peer.js` reorders SDP codec lines to prefer H.264 for Safari compatibility.
- **Active speaker detection**: `peer.js` uses `AnalyserNode` to measure volume and calls `App.setTalkingPeer()` to highlight the speaking participant.
