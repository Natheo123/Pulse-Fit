import type { Exercise, Equipment, FitnessLevel, MuscleGroup } from "../types";
import catalog from "./exercises.catalog.json";

const LOCAL_CORE = new Set([
  "bench-press",
  "dumbbell-press",
  "squat",
  "goblet-squat",
  "deadlift",
  "rdl",
  "lat-pulldown",
  "pull-up",
  "overhead-press",
  "row",
  "seated-row",
  "bicep-curl",
  "tricep-pushdown",
  "plank",
  "lunges",
]);

type RawExercise = {
  id: string;
  name: string;
  nameFr: string;
  muscles: string[];
  muscleLoad?: Record<string, number>;
  equipment: string[];
  level: string;
  instructions: string[];
  commonMistakes: string[];
  variants?: { easier?: string; harder?: string };
  defaultSets: number;
  defaultReps: number[];
  restSeconds: number;
  incrementKg: number;
  demoUrl?: string;
  demoVideo?: string;
  videoId?: string;
};

function normalize(raw: RawExercise): Exercise {
  const reps = raw.defaultReps;
  const ex: Exercise = {
    id: raw.id,
    name: raw.name,
    nameFr: raw.nameFr,
    muscles: raw.muscles as MuscleGroup[],
    muscleLoad: raw.muscleLoad as Exercise["muscleLoad"],
    equipment: raw.equipment as Equipment[],
    level: (raw.level as FitnessLevel) || "beginner",
    instructions: raw.instructions ?? [],
    commonMistakes: raw.commonMistakes ?? [],
    variants: raw.variants ?? {},
    defaultSets: raw.defaultSets ?? 3,
    defaultReps: [reps?.[0] ?? 8, reps?.[1] ?? 12],
    restSeconds: raw.restSeconds ?? 75,
    incrementKg: raw.incrementKg ?? 2.5,
    demoUrl: raw.demoUrl,
    demoVideo: raw.demoVideo,
    videoId: raw.videoId,
  };

  if (LOCAL_CORE.has(ex.id)) {
    ex.demoUrl = `/exercises/${ex.id}.png`;
    ex.demoVideo = `/exercises/${ex.id}.mp4`;
  }
  return ex;
}

export const EXERCISES: Exercise[] = (catalog as unknown as RawExercise[]).map(
  normalize
);

export function getExercise(id: string) {
  return EXERCISES.find((e) => e.id === id);
}

export function searchExercises(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return EXERCISES;
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.nameFr.toLowerCase().includes(q) ||
      e.id.includes(q)
  );
}
