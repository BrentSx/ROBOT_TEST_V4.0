const $ = (s) => document.querySelector(s);
const answers = new Set();
let DATA = null;
let myName = null;

// ---- tabs ----
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => showTab(t.dataset.tab));
});
function showTab(which) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === which));
  $("#tab-test").classList.toggle("hidden", which !== "test");
  $("#tab-board").classList.toggle("hidden", which !== "board");
  if (which === "board") loadBoard();
}

// ---- boot ----
// Load questions with a timeout + retries so a hung/cached request can't
// lock the UI forever. Safe to call repeatedly; no-ops once loaded.
async function ensureLoaded() {
  if (FLAT.length) return true;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      DATA = await fetch("/api/questions", { cache: "no-store", signal: ctrl.signal })
        .then(r => r.json());
      clearTimeout(t);
      buildQuiz();
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 600));
    }
  }
  return false;
}

(async function init() {
  ensureLoaded(); // preload in the background; the Begin click will await it too
  let me = { hasAccount: false };
  try { me = await fetch("/api/me", { cache: "no-store" }).then(r => r.json()); } catch (e) {}
  if (me.hasAccount) {
    $("#intro").innerHTML =
      `<h2 style="margin-top:0; text-align:center">You've already been tested, sir.</h2>
       <p style="color:var(--dim)">You already have an account${me.name ? " under <b>" + escapeHtml(me.name) + "</b>" : ""}. No rerolls. Check the scoreboard to see where you land.</p>
       <button class="primary" onclick="showTab('board')">See the Scoreboard →</button>`;
  }
})();

let FLAT = [];       // flattened questions with category info
let idx = 0;         // current question index
let animating = false;

function buildQuiz() {
  FLAT = [];
  for (const cat of DATA.categories)
    for (const q of cat.questions)
      FLAT.push({ ...q, catName: cat.name, catColor: cat.color });
  $("#total").textContent = FLAT.length;
  $("#rMax").textContent = DATA.max;
}

function renderQuestion(dir) {
  const q = FLAT[idx];
  const card = $("#qcard");
  $("#qCat").textContent = q.catName;
  $("#qCat").style.background = q.catColor;
  $("#qText").textContent = q.text;
  $("#qPts").textContent = "+" + q.pts;
  $("#qnum").textContent = idx + 1;
  $("#barFill").style.width = (idx / FLAT.length * 100) + "%";
  $("#btnBack").disabled = idx === 0;

  // reflect any previous answer visually (in case of going back)
  $("#btnYes").style.outline = answers.has(q.id) ? "3px solid #fff" : "none";
  $("#btnNo").style.outline = (!answers.has(q.id) && q.seen) ? "3px solid #fff" : "none";

  card.classList.remove("in-r", "in-l", "out-l", "out-r");
  void card.offsetWidth; // restart animation
  card.classList.add(dir === "back" ? "in-l" : "in-r");
}

function advance(dir) {
  if (animating) return;
  animating = true;
  const card = $("#qcard");
  card.classList.remove("in-r", "in-l");
  card.classList.add(dir === "back" ? "out-r" : "out-l");
  setTimeout(() => {
    if (dir === "back") { idx = Math.max(0, idx - 1); renderQuestion("back"); }
    else if (idx >= FLAT.length - 1) { animating = false; return submitTest(); }
    else { idx++; renderQuestion("fwd"); }
    animating = false;
  }, 200);
}

function answerCurrent(yes) {
  const q = FLAT[idx];
  q.seen = true;
  if (yes) answers.add(q.id); else answers.delete(q.id);
  advance("fwd");
}

$("#btnYes").addEventListener("click", () => answerCurrent(true));
$("#btnNo").addEventListener("click", () => answerCurrent(false));
$("#btnBack").addEventListener("click", () => advance("back"));
// keyboard: Y / N / arrows
document.addEventListener("keydown", (e) => {
  if ($("#quiz").classList.contains("hidden")) return;
  if (e.key === "y" || e.key === "Y" || e.key === "ArrowRight") answerCurrent(true);
  else if (e.key === "n" || e.key === "N") answerCurrent(false);
  else if (e.key === "ArrowLeft") advance("back");
});

// ---- start ----
$("#startBtn").addEventListener("click", async () => {
  const name = $("#name").value.trim();
  if (!name) { $("#introErr").textContent = "Enter a name first."; return; }

  const b = $("#startBtn");
  if (!FLAT.length) {
    $("#introErr").textContent = "";
    b.disabled = true; b.textContent = "Loading…";
    const ok = await ensureLoaded();
    b.disabled = false; b.textContent = "Begin →";
    if (!ok) {
      $("#introErr").textContent = "Couldn't load the test. Check your connection and tap Begin again.";
      return;
    }
  }

  myName = name;
  $("#intro").classList.add("hidden");
  $("#quiz").classList.remove("hidden");
  window.scrollTo({ top: 0 });
  idx = 0;
  renderQuestion("fwd");
});
$("#name").addEventListener("keydown", e => { if (e.key === "Enter") $("#startBtn").click(); });

// ---- submit ----
async function submitTest() {
  $("#quizErr").textContent = "Tallying…";
  $("#barFill").style.width = "100%";
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: myName, answers: [...answers] })
    });
    const data = await res.json();
    if (!res.ok) {
      $("#quizErr").textContent = data.error || "Something went wrong.";
      return;
    }
    $("#quizErr").textContent = "";
    showResult(data);
  } catch (e) {
    $("#quizErr").textContent = "Network error. Is the server running?";
  }
}

function showResult(data) {
  $("#quiz").classList.add("hidden");
  $("#result").classList.remove("hidden");
  $("#rMax").textContent = data.max;
  $("#rRank").textContent = `"${data.rank.name}"`;
  $("#rBlurb").textContent = data.rank.blurb;
  $("#rMeter").style.width = Math.min(100, data.score / data.max * 100) + "%";
  window.scrollTo({ top: 0 });

  // count up animation
  let cur = 0;
  const target = data.score;
  const step = Math.max(1, Math.round(target / 40));
  const el = $("#rScore");
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = cur;
  }, 25);
}

$("#toBoard").addEventListener("click", () => showTab("board"));

// ---- scoreboard ----
async function loadBoard() {
  const body = $("#boardBody");
  body.innerHTML = `<tr><td colspan="4" style="color:var(--dim)">Loading…</td></tr>`;
  const { board } = await fetch("/api/scoreboard").then(r => r.json());
  if (!board.length) {
    body.innerHTML = `<tr><td colspan="4" style="color:var(--dim)">No one has taken the test yet. Be the first.</td></tr>`;
    return;
  }
  body.innerHTML = board.map((u, i) => {
    const mine = myName && u.name.toLowerCase() === myName.toLowerCase();
    return `<tr class="${mine ? "me" : ""}">
      <td class="rank-num">${i + 1}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.rank)}</td>
      <td class="score">${u.score}</td>
    </tr>`;
  }).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
