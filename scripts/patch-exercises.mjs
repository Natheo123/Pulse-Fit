import fs from "fs";

const p = "src/lib/data/exercises.ts";
let s = fs.readFileSync(p, "utf8");

const meta = {
  "bench-press": {
    videoId: "rT7DgCr-3pg",
    muscleLoad: { chest: 1, triceps: 0.7, shoulders: 0.55 },
  },
  "dumbbell-press": {
    videoId: "VmB1G1K7v94",
    muscleLoad: { chest: 1, triceps: 0.65, shoulders: 0.5 },
  },
  squat: {
    videoId: "ultWZbUMPL8",
    muscleLoad: { legs: 1, glutes: 0.85, core: 0.45 },
  },
  "goblet-squat": {
    videoId: "MeIiIdrhYXY",
    muscleLoad: { legs: 0.9, glutes: 0.75, core: 0.5 },
  },
  deadlift: {
    videoId: "op9kVnSso6Q",
    muscleLoad: { back: 0.95, legs: 0.8, glutes: 0.9, core: 0.6 },
  },
  rdl: {
    videoId: "jEy_czb3RKA",
    muscleLoad: { back: 0.7, legs: 0.85, glutes: 0.95 },
  },
  "lat-pulldown": {
    videoId: "CAwf7n6Luuc",
    muscleLoad: { back: 1, biceps: 0.6 },
  },
  "pull-up": {
    videoId: "eGo4IYlbE5g",
    muscleLoad: { back: 1, biceps: 0.7 },
  },
  "overhead-press": {
    videoId: "2yjwXTZQDDI",
    muscleLoad: { shoulders: 1, triceps: 0.65, core: 0.4 },
  },
  row: {
    videoId: "FWJR5Ve8bnQ",
    muscleLoad: { back: 1, biceps: 0.65 },
  },
  "seated-row": {
    videoId: "GZbfZ033f74",
    muscleLoad: { back: 0.95, biceps: 0.6 },
  },
  "bicep-curl": {
    videoId: "ykJmrZ5v0Oo",
    muscleLoad: { biceps: 1 },
  },
  "tricep-pushdown": {
    videoId: "2-LaADoXbM8",
    muscleLoad: { triceps: 1 },
  },
  plank: {
    videoId: "ASdvN_XEl_c",
    muscleLoad: { core: 1 },
  },
  lunges: {
    videoId: "L8fvypPrzzs",
    muscleLoad: { legs: 0.95, glutes: 0.8 },
  },
};

for (const [id, data] of Object.entries(meta)) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?incrementKg: [^,\\n]+,)`);
  s = s.replace(re, (m) => {
    if (m.includes("videoId:")) return m;
    return `${m}\n    videoId: "${data.videoId}",\n    muscleLoad: ${JSON.stringify(data.muscleLoad)},`;
  });
}

fs.writeFileSync(p, s);
console.log("patched");
