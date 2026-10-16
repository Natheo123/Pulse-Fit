import { v4 as uuid } from "uuid";
import { getExercise } from "./data/exercises";
import type {
  ProgressionRecommendation,
  SessionExerciseLog,
  WorkoutSession,
} from "./types";

function averageReps(sets: SessionExerciseLog["sets"]) {
  const done = sets.filter((s) => s.completed && s.reps > 0);
  if (!done.length) return 0;
  return done.reduce((a, s) => a + s.reps, 0) / done.length;
}

function workingWeight(sets: SessionExerciseLog["sets"]) {
  const done = sets.filter((s) => s.completed && s.weight > 0);
  if (!done.length) return 0;
  return Math.max(...done.map((s) => s.weight));
}

/**
 * Règle explicable hors-ligne :
 * - Augmenter si toutes les séries sont dans/au-dessus de la fourchette haute
 * - Maintenir si dans la fourchette
 * - Diminuer si sous la fourchette basse ou RIR moyen <= 0 avec échec
 */
export function recommendProgression(
  session: WorkoutSession,
  exerciseLog: SessionExerciseLog,
  targetReps: [number, number] = [8, 12]
): ProgressionRecommendation | null {
  const exercise = getExercise(exerciseLog.exerciseId);
  if (!exercise || exercise.incrementKg <= 0) return null;

  const completed = exerciseLog.sets.filter((s) => s.completed);
  if (completed.length < 2) return null;

  const avg = averageReps(completed);
  const weight = workingWeight(completed);
  const avgRir =
    completed.filter((s) => typeof s.rir === "number").length > 0
      ? completed.reduce((a, s) => a + (s.rir ?? 2), 0) / completed.length
      : 2;

  const [low, high] = targetReps;
  const allAtOrAboveHigh = completed.every((s) => s.reps >= high);
  const anyBelowLow = completed.some((s) => s.reps < low);

  let action: ProgressionRecommendation["action"] = "maintain";
  let suggested = weight;
  let ruleId = "maintain-in-range";
  let explanation = `Tu as moyenne ${avg.toFixed(1)} reps à ${weight} kg (cible ${low}–${high}). Garde la même charge pour consolider.`;

  if (allAtOrAboveHigh && avgRir >= 1.5) {
    action = "increase";
    suggested = Math.round((weight + exercise.incrementKg) * 2) / 2;
    ruleId = "increase-hit-top-reps";
    explanation = `Toutes les séries ≥ ${high} reps à ${weight} kg avec une marge (RIR ~${avgRir.toFixed(1)}). Prochaine séance : ${suggested} kg (+${exercise.incrementKg} kg).`;
  } else if (anyBelowLow || avgRir <= 0.5) {
    action = "decrease";
    suggested = Math.max(0, Math.round((weight - exercise.incrementKg) * 2) / 2);
    ruleId = "decrease-missed-range";
    explanation = `Certaines séries sont sous ${low} reps ou l'effort est trop limite (RIR ~${avgRir.toFixed(1)}). Essaie ${suggested} kg pour retrouver de la qualité.`;
  }

  return {
    id: uuid(),
    exerciseId: exerciseLog.exerciseId,
    action,
    currentWeight: weight,
    suggestedWeight: suggested,
    explanation,
    ruleId,
    basedOnSessionId: session.id,
    createdAt: new Date().toISOString(),
  };
}

export function estimate1RM(weight: number, reps: number) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Epley
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
