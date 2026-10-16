import type { MuscleGroup } from "./types";

/** Faisceaux / chefs musculaires précis */
export type FascicleId =
  | "chest_clavicular"
  | "chest_sternal"
  | "chest_abdominal"
  | "delt_anterior"
  | "delt_lateral"
  | "delt_posterior"
  | "biceps_long"
  | "biceps_short"
  | "triceps_long"
  | "triceps_lateral"
  | "triceps_medial"
  | "traps_upper"
  | "traps_mid"
  | "lats"
  | "rhomboids"
  | "erectors"
  | "quads_rectus"
  | "quads_vastus"
  | "hamstrings"
  | "glute_max"
  | "abs_recto"
  | "abs_oblique"
  | "calves";

export const FASCICLE_LABELS: Record<FascicleId, string> = {
  chest_clavicular: "Faisceau claviculaire",
  chest_sternal: "Faisceau sterno-costal",
  chest_abdominal: "Faisceau abdominal",
  delt_anterior: "Deltoïde antérieur",
  delt_lateral: "Deltoïde moyen",
  delt_posterior: "Deltoïde postérieur",
  biceps_long: "Biceps · longue portion",
  biceps_short: "Biceps · courte portion",
  triceps_long: "Triceps · longue portion",
  triceps_lateral: "Triceps · vaste latéral",
  triceps_medial: "Triceps · vaste médial",
  traps_upper: "Trapèze supérieur",
  traps_mid: "Trapèze moyen",
  lats: "Grand dorsal",
  rhomboids: "Rhomboïdes",
  erectors: "Érecteurs du rachis",
  quads_rectus: "Droit fémoral",
  quads_vastus: "Vastes (quadriceps)",
  hamstrings: "Ischio-jambiers",
  glute_max: "Grand fessier",
  abs_recto: "Grand droit",
  abs_oblique: "Obliques",
  calves: "Mollets",
};

export type FascicleLoad = Partial<Record<FascicleId, number>>;

/** Répartition par défaut quand on n’a que le groupe musculaire global */
const GROUP_TO_FASCICLES: Record<MuscleGroup, Partial<Record<FascicleId, number>>> = {
  chest: {
    chest_clavicular: 0.75,
    chest_sternal: 1,
    chest_abdominal: 0.65,
  },
  shoulders: {
    delt_anterior: 0.85,
    delt_lateral: 1,
    delt_posterior: 0.55,
  },
  biceps: {
    biceps_long: 1,
    biceps_short: 0.9,
  },
  triceps: {
    triceps_long: 0.85,
    triceps_lateral: 1,
    triceps_medial: 0.7,
  },
  back: {
    traps_upper: 0.55,
    traps_mid: 0.8,
    lats: 1,
    rhomboids: 0.75,
    erectors: 0.4,
  },
  legs: {
    quads_rectus: 0.9,
    quads_vastus: 1,
    hamstrings: 0.7,
    calves: 0.45,
  },
  glutes: {
    glute_max: 1,
  },
  core: {
    abs_recto: 1,
    abs_oblique: 0.7,
  },
  full_body: {},
};

/** Profils fins par exercice (prioritaires sur la répartition générique) */
export const EXERCISE_FASCICLES: Record<string, FascicleLoad> = {
  "bench-press": {
    chest_sternal: 1,
    chest_clavicular: 0.7,
    chest_abdominal: 0.55,
    delt_anterior: 0.55,
    triceps_lateral: 0.65,
    triceps_medial: 0.5,
  },
  "dumbbell-press": {
    chest_sternal: 0.95,
    chest_clavicular: 0.8,
    chest_abdominal: 0.6,
    delt_anterior: 0.5,
    triceps_lateral: 0.55,
  },
  squat: {
    quads_vastus: 1,
    quads_rectus: 0.9,
    glute_max: 0.85,
    hamstrings: 0.45,
    abs_recto: 0.4,
    erectors: 0.35,
  },
  "goblet-squat": {
    quads_vastus: 0.95,
    quads_rectus: 0.85,
    glute_max: 0.75,
    abs_recto: 0.5,
  },
  deadlift: {
    erectors: 0.95,
    glute_max: 0.9,
    hamstrings: 0.85,
    traps_upper: 0.7,
    lats: 0.55,
    quads_vastus: 0.5,
  },
  rdl: {
    hamstrings: 1,
    glute_max: 0.9,
    erectors: 0.65,
    traps_mid: 0.35,
  },
  "lat-pulldown": {
    lats: 1,
    rhomboids: 0.7,
    traps_mid: 0.55,
    biceps_long: 0.55,
    delt_posterior: 0.35,
  },
  "pull-up": {
    lats: 1,
    rhomboids: 0.75,
    traps_mid: 0.6,
    biceps_long: 0.65,
    delt_posterior: 0.4,
  },
  "overhead-press": {
    delt_anterior: 1,
    delt_lateral: 0.85,
    triceps_lateral: 0.6,
    traps_upper: 0.45,
    abs_recto: 0.35,
  },
  row: {
    lats: 0.85,
    rhomboids: 1,
    traps_mid: 0.9,
    delt_posterior: 0.55,
    biceps_short: 0.55,
  },
  "seated-row": {
    rhomboids: 0.95,
    traps_mid: 0.9,
    lats: 0.8,
    biceps_short: 0.5,
  },
  "bicep-curl": {
    biceps_long: 1,
    biceps_short: 0.95,
  },
  "tricep-pushdown": {
    triceps_lateral: 1,
    triceps_medial: 0.85,
    triceps_long: 0.55,
  },
  plank: {
    abs_recto: 1,
    abs_oblique: 0.75,
    erectors: 0.35,
  },
  lunges: {
    quads_vastus: 0.95,
    quads_rectus: 0.85,
    glute_max: 0.8,
    hamstrings: 0.4,
  },
};

export function resolveFascicles(
  exerciseId: string | undefined,
  muscleLoad?: Partial<Record<MuscleGroup, number>>
): FascicleLoad {
  if (exerciseId && EXERCISE_FASCICLES[exerciseId]) {
    return EXERCISE_FASCICLES[exerciseId];
  }
  const out: FascicleLoad = {};
  if (!muscleLoad) return out;
  for (const [group, intensity] of Object.entries(muscleLoad) as [
    MuscleGroup,
    number,
  ][]) {
    const map = GROUP_TO_FASCICLES[group];
    if (!map) continue;
    for (const [f, w] of Object.entries(map) as [FascicleId, number][]) {
      out[f] = Math.min(1, Math.max(out[f] ?? 0, intensity * w));
    }
  }
  return out;
}

export function aggregateFascicles(loads: FascicleLoad[]): FascicleLoad {
  const out: FascicleLoad = {};
  for (const load of loads) {
    for (const [k, v] of Object.entries(load) as [FascicleId, number][]) {
      out[k] = Math.min(1, Math.max(out[k] ?? 0, v));
    }
  }
  return out;
}

export function fasciclesFromFocus(
  focus: MuscleGroup | "balanced" | "arms"
): FascicleLoad {
  if (focus === "balanced") return {};
  if (focus === "arms") {
    return {
      biceps_long: 1,
      biceps_short: 0.9,
      triceps_lateral: 1,
      triceps_long: 0.75,
      triceps_medial: 0.7,
    };
  }
  if (focus === "chest") {
    return {
      chest_clavicular: 0.85,
      chest_sternal: 1,
      chest_abdominal: 0.7,
      delt_anterior: 0.4,
    };
  }
  return resolveFascicles(undefined, { [focus]: 1 });
}
