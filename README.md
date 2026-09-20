# ROBOT_TEST_V4.0

The Robot Test V4.0 — *Darker and Edgier*. A web app: sign up, take the test, get your score and rank, and climb the scoreboard.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploy on Railway

1. Push this repo to GitHub.
2. On [Railway](https://railway.app), create a new project → **Deploy from GitHub repo** → pick this repo.
3. Railway auto-detects Node, runs `npm install`, and starts with `npm start`. The app listens on `process.env.PORT` automatically.

No environment variables required.

> Note: scores are stored in `data.json` on the local filesystem. Railway's filesystem is ephemeral, so the scoreboard resets on redeploy. Add a Railway Volume (or a database) if you need scores to persist.

## Stack

- Node.js + Express
- Vanilla HTML/CSS/JS frontend
- Server-side scoring (scores can't be spoofed from the client)
