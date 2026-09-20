const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { CATEGORIES, RANKS, maxScore, rankFor, pointsMap } = require("./questions");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");
const PTS = pointsMap();
const MAX = maxScore();

app.set("trust proxy", true); // so req.ip reflects the real client behind a proxy
app.use(express.json());
// Always revalidate HTML/JS so a new deploy is never masked by a stale cache.
app.use((req, res, next) => {
  if (/\.(html|js)$/.test(req.path) || req.path === "/") {
    res.set("Cache-Control", "no-cache, must-revalidate");
  }
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// ---- tiny JSON "database" -------------------------------------------------
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { users: [] };
  }
}
function saveDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function clientIp(req) {
  // normalise IPv6-mapped IPv4 and localhost forms
  let ip = (req.ip || req.connection.remoteAddress || "").toString();
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
}
function hashIp(ip) {
  // store a hash, not the raw IP, so the file isn't a list of people's addresses
  return crypto.createHash("sha256").update("robot-salt:" + ip).digest("hex");
}

// ---- API ------------------------------------------------------------------

// Serve question data to the client (without trusting the client for points).
app.get("/api/questions", (req, res) => {
  res.json({ categories: CATEGORIES, ranks: RANKS, max: MAX });
});

// Has this IP already got an account? Used to gate the UI up front.
app.get("/api/me", (req, res) => {
  const db = loadDB();
  const ipHash = hashIp(clientIp(req));
  const existing = db.users.find(u => u.ipHash === ipHash);
  res.json({ hasAccount: !!existing, name: existing ? existing.name : null });
});

// Submit the test. One account per IP.
app.post("/api/submit", (req, res) => {
  const { name, answers } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Pick a name, sir." });
  }
  const cleanName = name.trim().slice(0, 24);
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "Malformed answers." });
  }

  const db = loadDB();
  const ipHash = hashIp(clientIp(req));

  if (db.users.find(u => u.ipHash === ipHash)) {
    return res.status(409).json({
      error: "You've already taken the test, sir. No rerolls."
    });
  }
  if (db.users.find(u => u.name.toLowerCase() === cleanName.toLowerCase())) {
    return res.status(409).json({ error: "That name is taken. Choose another." });
  }

  // Score on the server using the trusted points map. Client can't inflate.
  let score = 0;
  const chosen = new Set(answers);
  for (const id of chosen) {
    if (Object.prototype.hasOwnProperty.call(PTS, id)) score += PTS[id];
  }

  const rank = rankFor(score);
  const user = {
    id: crypto.randomBytes(6).toString("hex"),
    name: cleanName,
    score,
    rank: rank.name,
    ipHash,
    date: new Date().toISOString()
  };
  db.users.push(user);
  saveDB(db);

  res.json({ score, max: MAX, rank, name: cleanName });
});

// Public scoreboard (no IPs, no answers leaked).
app.get("/api/scoreboard", (req, res) => {
  const db = loadDB();
  const board = db.users
    .map(u => ({ name: u.name, score: u.score, rank: u.rank, date: u.date }))
    .sort((a, b) => b.score - a.score);
  res.json({ board, max: MAX });
});

app.listen(PORT, () => {
  console.log(`The Robot Test V4.0 running at http://localhost:${PORT}`);
});
