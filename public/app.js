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
(async function init() {
  DATA = await fetch("/api/questions").then(r => r.json());
  buildQuiz();
  const me = await fetch("/api/me").then(r => r.json());
  if (me.hasAccount) {
    $("#intro").innerHTML =
      `<h2 style="margin-top:0; text-align:center">You've already been tested, sir.</h2>
       <p style="color:var(--dim)">You already have an account${me.name ? " under <b>" + escapeHtml(me.name) + "</b>" : ""}. No rerolls. Check the scoreboard to see where you land.</p>
       <button class="primary" onclick="showTab('board')">See the Scoreboard →</button>`;
  }
})();

function buildQuiz() {
  const total = DATA.categories.reduce((n, c) => n + c.questions.length, 0);
  $("#total").textContent = total;
  $("#rMax").textContent = DATA.max;

  const host = $("#cats");
  host.innerHTML = "";
  for (const cat of DATA.categories) {
    const div = document.createElement("div");
    div.className = "cat";
    div.style.background = "rgba(255,255,255,.02)";
    const head = document.createElement("h2");
    head.textContent = cat.name;
    head.style.background = cat.color;
    div.appendChild(head);

    for (const q of cat.questions) {
      const row = document.createElement("div");
      row.className = "q";
      row.innerHTML =
        `<div class="check">✓</div><div class="txt">${escapeHtml(q.text)}</div><div class="pts">+${q.pts}</div>`;
      row.addEventListener("click", () => {
        if (answers.has(q.id)) { answers.delete(q.id); row.classList.remove("on"); }
        else { answers.add(q.id); row.classList.add("on"); }
        updateProgress();
      });
      div.appendChild(row);
    }
    host.appendChild(div);
  }
}

function updateProgress() {
  const total = Number($("#total").textContent);
  $("#answered").textContent = answers.size;
  $("#barFill").style.width = total ? (answers.size / total * 100) + "%" : "0%";
}

// ---- start ----
$("#startBtn").addEventListener("click", () => {
  const name = $("#name").value.trim();
  if (!name) { $("#introErr").textContent = "Enter a name first."; return; }
  myName = name;
  $("#intro").classList.add("hidden");
  $("#quiz").classList.remove("hidden");
  window.scrollTo({ top: 0 });
});
$("#name").addEventListener("keydown", e => { if (e.key === "Enter") $("#startBtn").click(); });

// ---- submit ----
$("#submitBtn").addEventListener("click", async () => {
  $("#submitBtn").disabled = true;
  $("#quizErr").textContent = "";
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: myName, answers: [...answers] })
    });
    const data = await res.json();
    if (!res.ok) {
      $("#quizErr").textContent = data.error || "Something went wrong.";
      $("#submitBtn").disabled = false;
      return;
    }
    showResult(data);
  } catch (e) {
    $("#quizErr").textContent = "Network error. Is the server running?";
    $("#submitBtn").disabled = false;
  }
});

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
