// The Robot Test V4.0 data. Shared between server (scoring) and client (rendering).
// Each question has a stable id so scores can't be spoofed by editing labels.

const CATEGORIES = [
  {
    name: "Physical",
    color: "#b0202a",
    questions: [
      { id: "p1", text: "Have an attractive face", pts: 5 },
      { id: "p2", text: "Healthy weight for your age and sex", pts: 4 },
      { id: "p3", text: "Particularly fit / strong / muscular", pts: 2 },
      { id: "p4", text: "At least 6'0 tall (M) / Good figure (F)", pts: 3 },
      { id: "p5", text: "Exercise regularly", pts: 1 },
      { id: "p6", text: "Have a decently healthy diet", pts: 1 },
      { id: "p7", text: "Minor or no physical abnormalities", pts: 3 },
      { id: "p8", text: "No smoking addiction — vaping included", pts: 1 },
      { id: "p9", text: "Don't smoke weed / only occasionally", pts: 1 },
      { id: "p10", text: "No alcohol addiction", pts: 1 },
      { id: "p11", text: "No addiction to any other drugs", pts: 2 },
      { id: "p12", text: "Good dental hygiene", pts: 1 },
      { id: "p13", text: "Shower regularly", pts: 2 },
      { id: "p14", text: "Have at least a decent fashion sense", pts: 2 },
      { id: "p15", text: "Visit a doctor regularly", pts: 1 },
      { id: "p16", text: "Have a good hairstyle", pts: 2 },
      { id: "p17", text: "Take pride in your body", pts: 1 }
    ]
  },
  {
    name: "Mental",
    color: "#1f5fa8",
    questions: [
      { id: "m1", text: "No significant autism, aspergers, etc.", pts: 3 },
      { id: "m2", text: "No significant depression", pts: 3 },
      { id: "m3", text: "Taking meds or therapy if applicable", pts: 1 },
      { id: "m4", text: "Feel content or happy most of the time", pts: 3 },
      { id: "m5", text: "Feel love for someone, family included", pts: 2 },
      { id: "m6", text: "You think you're a nice person", pts: 1 },
      { id: "m7", text: "Not anxious around family / friends", pts: 3 },
      { id: "m8", text: "Not uncomfortable around strangers", pts: 1 },
      { id: "m9", text: "Don't feel anxious about going outside", pts: 2 },
      { id: "m10", text: "Don't feel stared at when outside", pts: 1 },
      { id: "m11", text: "Feel motivation during the day", pts: 2 },
      { id: "m12", text: "No wild changes in emotion", pts: 1 },
      { id: "m13", text: "Have a clean conscience", pts: 2 },
      { id: "m14", text: "Don't find joy in shocking / gory material", pts: 1 },
      { id: "m15", text: "Get to sleep (quite) easily at night", pts: 1 },
      { id: "m16", text: "Get up (quite) easily in the morning", pts: 1 },
      { id: "m17", text: "No sexual attraction to under-15s", pts: 3 }
    ]
  },
  {
    name: "Social",
    color: "#2e8b40",
    questions: [
      { id: "s1", text: "Had at least one romantic partner before", pts: 5 },
      { id: "s2", text: "Had multiple romantic partners before", pts: 3 },
      { id: "s3", text: "Not a virgin", pts: 8 },
      { id: "s4", text: "Had sex with multiple partners before", pts: 4 },
      { id: "s5", text: "Kissed romantically before", pts: 3 },
      { id: "s6", text: "Held hands romantically before", pts: 1 },
      { id: "s7", text: "Had a relationship in the last 6 months", pts: 2 },
      { id: "s8", text: "Have a good relationship with family", pts: 2 },
      { id: "s9", text: "Have at least one friend in real life", pts: 3 },
      { id: "s10", text: "Have at least several friends in real life", pts: 4 },
      { id: "s11", text: "Socialise at least once a week", pts: 1 },
      { id: "s12", text: "Socialise at least once a day", pts: 1 },
      { id: "s13", text: "Leave the house on the regular", pts: 1 },
      { id: "s14", text: "Enjoy being around others on occasion", pts: 1 },
      { id: "s15", text: "Enjoy being around others when possible", pts: 4 },
      { id: "s16", text: "Recreational screen-time up to 4h a day", pts: 1 },
      { id: "s17", text: "Use social networks regularly", pts: 2 }
    ]
  },
  {
    name: "Accomplishment",
    color: "#7a3a9e",
    questions: [
      { id: "a1", text: "Don't live with your parents", pts: 3 },
      { id: "a2", text: "Own a vehicle", pts: 1 },
      { id: "a3", text: "In education, employment or training", pts: 4 },
      { id: "a4", text: "Have a hobby or sport — not vidya, etc.", pts: 1 },
      { id: "a5", text: "Have a productive talent, e.g. cooking", pts: 2 },
      { id: "a6", text: "Own or rent a living space", pts: 2 },
      { id: "a7", text: "Keep your living space clean", pts: 1 },
      { id: "a8", text: "Moving forward in life", pts: 2 },
      { id: "a9", text: "Have material items to be proud of", pts: 1 },
      { id: "a10", text: "Won an award to be proud of", pts: 1 },
      { id: "a11", text: "Have children you're proud of", pts: 1 },
      { id: "a12", text: "Gone travelling / vacation in the past year", pts: 1 },
      { id: "a13", text: "Manage your money well", pts: 2 },
      { id: "a14", text: "Live a largely independent life", pts: 2 },
      { id: "a15", text: "Take care of a pet", pts: 1 },
      { id: "a16", text: "Attend(ed) higher education", pts: 2 },
      { id: "a17", text: "Have a college degree", pts: 3 }
    ]
  },
  {
    name: "Bonus Round!",
    color: "#d2691e",
    questions: [
      { id: "b1", text: "You are female", pts: 6 },
      { id: "b2", text: "Have plenty of disposable income", pts: 3 },
      { id: "b3", text: "Have a very large number of contacts", pts: 3 },
      { id: "b4", text: "Have little interest in anime", pts: 2 },
      { id: "b5", text: "Have no interest in tabletop gaming", pts: 1 },
      { id: "b6", text: "Gaming is mostly limited to console", pts: 2 },
      { id: "b7", text: "Healthy view of the opposite sex", pts: 3 },
      { id: "b8", text: "No criminal record as an adult", pts: 1 },
      { id: "b9", text: "Been texted by a real person recently", pts: 1 },
      { id: "b10", text: "Enjoy using YikYak and/or Snapchat", pts: 1 },
      { id: "b11", text: "You have a decent smartphone", pts: 3 },
      { id: "b12", text: "Fetish: None / Feet / BDSM / DP etc.", pts: 1 },
      { id: "b13", text: "Don't consume hentai / ecchi etc. material", pts: 1 }
    ]
  }
];

const RANKS = [
  { min: 0,   max: 8,   name: "Grand Wizard",     blurb: "No longer human. You are barely attached to the living world by a thin thread. You straddle the line between this world and the next." },
  { min: 9,   max: 24,  name: "Wizard",           blurb: "You have given up conventional human desires in favour of magical powers. Your soul may fuel powerful spells." },
  { min: 25,  max: 34,  name: "Wizard Apprentice", blurb: "Although hope for you is bleak, it is not impossible. Great potential for magic, but it may cost your soul." },
  { min: 35,  max: 58,  name: "Robot",            blurb: "Your flesh has turned to metal. An outsider looking in — however, this would require going outside." },
  { min: 59,  max: 81,  name: "Cyborg",           blurb: "A sorry amalgam of robot and regular human. You linger in two worlds at once, at home in neither. On your own with your feels." },
  { min: 82,  max: 94,  name: "Slightly Strange", blurb: "You have several qualities of a robot but participate largely in the normalfag world. You can hang with normals but sense you're not quite one of them." },
  { min: 95,  max: 115, name: "Normalfag",        blurb: "You don't necessarily have the best genes or looks, but you find socialising easy and have had plenty of relationships. A typical, functional human." },
  { min: 116, max: 129, name: "Chad / Stacey",    blurb: "A step above the average normie. Blessed with good genetics — you don't need to work very hard to get what you want. The normies are a little jealous." },
  { min: 130, max: 999, name: "Successful",       blurb: "Your looks, intelligence and charisma have helped you overcome struggles. A shining example of a human." }
];

function maxScore() {
  return CATEGORIES.reduce((t, c) => t + c.questions.reduce((s, q) => s + q.pts, 0), 0);
}

function rankFor(score) {
  return RANKS.find(r => score >= r.min && score <= r.max) || RANKS[RANKS.length - 1];
}

// Build a lookup of id -> points for trustworthy server-side scoring.
function pointsMap() {
  const map = {};
  for (const c of CATEGORIES) for (const q of c.questions) map[q.id] = q.pts;
  return map;
}

if (typeof module !== "undefined") {
  module.exports = { CATEGORIES, RANKS, maxScore, rankFor, pointsMap };
}
