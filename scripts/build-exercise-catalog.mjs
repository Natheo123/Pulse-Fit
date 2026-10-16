/**
 * Build a large PulseFit exercise catalog from Lyfta public pages.
 * Keeps stable IDs for the original core set used by programs.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src/lib/data/exercises.catalog.json");

const CORE_ALIASES = {
  "bench-press-7": "bench-press",
  "dumbbell-bench-press-84": "dumbbell-press",
  "full-squat-n": "squat",
  "goblet-squat-ge": "goblet-squat",
  "deadlift-2": "deadlift",
  "romanian-deadlift-65": "rdl",
  "cable-wide-grip-lat-pulldown--7v7": "lat-pulldown",
  "pull-up-1i": "pull-up",
  "barbell-standing-military-press--756": "overhead-press",
  "bent-over-row-9": "row",
  "straight-back-seated-row-7c": "seated-row",
  "biceps-curl-8j": "bicep-curl",
  "triceps-pushdown-7e": "tricep-pushdown",
  "front-plank-6m3": "plank",
  "walking-lunge-fm": "lunges",
};

const EQUIP_MAP = {
  barbell: ["full_gym"],
  dumbbell: ["dumbbells", "home", "full_gym"],
  dumbbells: ["dumbbells", "home", "full_gym"],
  kettlebell: ["home", "full_gym"],
  cable: ["machines", "full_gym"],
  machine: ["machines", "full_gym"],
  lever: ["machines", "full_gym"],
  smith: ["machines", "full_gym"],
  band: ["home", "bodyweight", "full_gym"],
  bands: ["home", "bodyweight", "full_gym"],
  bodyweight: ["bodyweight", "home", "full_gym"],
  "body only": ["bodyweight", "home", "full_gym"],
  none: ["bodyweight", "home", "full_gym"],
  "medicine ball": ["home", "full_gym"],
  "stability ball": ["home", "full_gym"],
  "exercise ball": ["home", "full_gym"],
  "ez barbell": ["full_gym"],
  "trap bar": ["full_gym"],
  sled: ["full_gym"],
  rope: ["machines", "full_gym"],
};

const MUSCLE_MAP = {
  chest: "chest",
  back: "back",
  shoulders: "shoulders",
  "upper arms": "biceps",
  biceps: "biceps",
  triceps: "triceps",
  "upper legs": "legs",
  thighs: "legs",
  legs: "legs",
  hips: "glutes",
  glutes: "glutes",
  waist: "core",
  abs: "core",
  core: "core",
  cardio: "full_body",
  "full body": "full_body",
  calves: "legs",
  forearms: "biceps",
  neck: "shoulders",
};

const FR_HINTS = [
  [/bench press/i, "Développé couché"],
  [/dumbbell/i, "Haltères"],
  [/barbell/i, "Barre"],
  [/squat/i, "Squat"],
  [/deadlift/i, "Soulevé de terre"],
  [/row/i, "Rowing"],
  [/pulldown|pull-down/i, "Tirage vertical"],
  [/pull-?up/i, "Tractions"],
  [/push-?up/i, "Pompes"],
  [/curl/i, "Curl"],
  [/press/i, "Développé"],
  [/lunge/i, "Fentes"],
  [/plank/i, "Planche"],
  [/crunch/i, "Crunch"],
  [/extension/i, "Extension"],
  [/fly|flye/i, "Écarté"],
  [/raise/i, "Élévation"],
  [/shrug/i, "Shrug"],
  [/hip thrust/i, "Hip thrust"],
  [/calf/i, "Mollets"],
  [/dip/i, "Dips"],
];

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function mapEquipment(raw) {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const out = new Set();
  for (const item of list) {
    const key = String(item).toLowerCase().trim();
    const mapped = EQUIP_MAP[key];
    if (mapped) mapped.forEach((e) => out.add(e));
    else if (key.includes("dumbbell")) ["dumbbells", "home", "full_gym"].forEach((e) => out.add(e));
    else if (key.includes("cable") || key.includes("machine") || key.includes("lever"))
      ["machines", "full_gym"].forEach((e) => out.add(e));
    else if (key.includes("body") || key.includes("none"))
      ["bodyweight", "home", "full_gym"].forEach((e) => out.add(e));
    else out.add("full_gym");
  }
  if (!out.size) out.add("full_gym");
  // Full gym always can do any exercise tagged here
  out.add("full_gym");
  return [...out];
}

function mapMuscles(raw) {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const out = [];
  for (const item of list) {
    const key = String(item).toLowerCase().trim();
    const m = MUSCLE_MAP[key];
    if (m && !out.includes(m)) out.push(m);
  }
  return out.length ? out : ["full_body"];
}

function nameFrFrom(name) {
  for (const [re, fr] of FR_HINTS) {
    if (re.test(name)) return `${fr} — ${name}`;
  }
  return name;
}

function muscleLoadFrom(muscles) {
  const load = {};
  muscles.forEach((m, i) => {
    load[m] = i === 0 ? 1 : Math.max(0.35, 0.75 - i * 0.15);
  });
  return load;
}

async function loadSitemapUrls() {
  const r = await fetch("https://www.lyfta.app/sitemaps/sitemap1.xml");
  const t = await r.text();
  return [...new Set([...t.matchAll(/https:\/\/www\.lyfta\.app\/exercise\/[a-z0-9-]+/gi)].map((m) => m[0]))];
}

function prioritize(urls) {
  const score = (u) => {
    const s = u.toLowerCase();
    let n = 0;
    if (/dumbbell|kettlebell|bodyweight|push-up|plank|squat|deadlift|bench|row|curl|press|lunge|pull-up|dip|crunch|raise|fly|extension|pulldown|cable|machine|barbell/.test(s))
      n += 5;
    if (/female|assisted|stretch|yoga|jump|smith|leverage/.test(s)) n -= 2;
    if (Object.keys(CORE_ALIASES).some((k) => s.endsWith(k) || s.includes(k))) n += 20;
    return n;
  };
  return urls
    .map((u) => ({ u, s: score(u) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.u);
}

async function fetchExercise(url) {
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok) return null;
  const html = await r.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!m) return null;
  const j = JSON.parse(m[1]);
  const d = j?.props?.pageProps?.firstData;
  if (!d?.video_file || !d?.name) return null;
  const slug = url.split("/").pop();
  const id = CORE_ALIASES[slug] || slugify(slug);
  const muscles = mapMuscles(d.body_part_id);
  const equipment = mapEquipment(d.equipment_id);
  return {
    id,
    name: d.name,
    nameFr: nameFrFrom(d.name),
    muscles,
    muscleLoad: muscleLoadFrom(muscles),
    equipment,
    level: "beginner",
    instructions: Array.isArray(d.ex_instructions)
      ? d.ex_instructions.slice(0, 6)
      : ["Exécute le mouvement avec contrôle.", "Garde une posture stable.", "Respire sur l'effort."],
    commonMistakes: Array.isArray(d.exercise_tips)
      ? d.exercise_tips.slice(0, 3).map((t) => String(t).slice(0, 120))
      : ["Amplitude incomplète", "Utiliser l'élan"],
    variants: {},
    defaultSets: 3,
    defaultReps: [8, 12],
    restSeconds: 75,
    incrementKg: equipment.includes("dumbbells") && !equipment.includes("machines") ? 2 : 2.5,
    demoUrl: d.image_name || undefined,
    demoVideo: d.video_file,
    videoId: typeof d.video_name === "string" && /^[\w-]{6,}$/.test(d.video_name) ? d.video_name : undefined,
    _lyftaSlug: slug,
  };
}

async function mapPool(items, concurrency, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return out;
}

const TARGET = Number(process.env.CATALOG_SIZE || 220);

const urls = prioritize(await loadSitemapUrls());
console.log("sitemap urls", urls.length);

const picked = urls.slice(0, Math.max(TARGET * 2, 400)); // fetch extra to absorb failures
const results = await mapPool(picked, 8, async (url, idx) => {
  try {
    const ex = await fetchExercise(url);
    if (ex) console.log("OK", idx, ex.id);
    else console.log("SKIP", idx, url.split("/").pop());
    return ex;
  } catch (e) {
    console.log("ERR", idx, e.message);
    return null;
  }
});

const byId = new Map();
for (const ex of results) {
  if (!ex) continue;
  if (!byId.has(ex.id)) byId.set(ex.id, ex);
}

// Ensure core aliases present even if not in first slice
for (const [slug, id] of Object.entries(CORE_ALIASES)) {
  if (byId.has(id)) continue;
  const ex = await fetchExercise(`https://www.lyfta.app/exercise/${slug}`);
  if (ex) {
    ex.id = id;
    byId.set(id, ex);
    console.log("CORE", id);
  }
}

let list = [...byId.values()];

// Balance equipment buckets
function bucket(eq) {
  if (eq.includes("dumbbells") && !eq.includes("machines")) return "dumbbells";
  if (eq.includes("bodyweight") && eq.length <= 3 && !eq.includes("dumbbells") && !eq.includes("machines"))
    return "bodyweight";
  if (eq.includes("machines")) return "machines";
  return "gym";
}

const groups = { dumbbells: [], bodyweight: [], machines: [], gym: [] };
for (const ex of list) groups[bucket(ex.equipment)].push(ex);

const balanced = [];
const quotas = {
  dumbbells: Math.floor(TARGET * 0.28),
  bodyweight: Math.floor(TARGET * 0.22),
  machines: Math.floor(TARGET * 0.22),
  gym: Math.floor(TARGET * 0.28),
};
for (const [k, n] of Object.entries(quotas)) {
  balanced.push(...groups[k].slice(0, n));
}
// fill remaining
const used = new Set(balanced.map((e) => e.id));
for (const ex of list) {
  if (balanced.length >= TARGET) break;
  if (!used.has(ex.id)) balanced.push(ex);
}

// Prefer local assets when present
for (const ex of balanced) {
  const localMp4 = path.join(ROOT, "public/exercises", `${ex.id}.mp4`);
  const localPng = path.join(ROOT, "public/exercises", `${ex.id}.png`);
  if (fs.existsSync(localMp4)) ex.demoVideo = `/exercises/${ex.id}.mp4`;
  if (fs.existsSync(localPng)) ex.demoUrl = `/exercises/${ex.id}.png`;
}

balanced.sort((a, b) => a.name.localeCompare(b.name));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(balanced, null, 2));
console.log(
  "wrote",
  balanced.length,
  "equip:",
  Object.fromEntries(Object.keys(groups).map((k) => [k, balanced.filter((e) => bucket(e.equipment) === k).length]))
);
