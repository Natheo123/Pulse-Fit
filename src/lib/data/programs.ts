import type { FitnessLevel, Goal, Equipment, Program } from "../types";

export const PROGRAMS: Program[] = [
  {
    id: "beginner-fullbody",
    title: "Full Body Débutant",
    description: "3 séances full body pour apprendre les mouvements de base et progresser en sécurité.",
    level: "beginner",
    weeks: 8,
    goals: ["keep_fit", "build_muscle"],
    equipment: ["full_gym", "dumbbells"],
    tags: ["Débutant", "Full body"],
    days: [
      {
        id: "bfb-a",
        name: "Full Body A",
        focus: "Squat + poussée",
        exercises: [
          { exerciseId: "goblet-squat", sets: 3, reps: [10, 12], restSeconds: 75 },
          { exerciseId: "dumbbell-press", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "seated-row", sets: 3, reps: [10, 12], restSeconds: 75 },
          { exerciseId: "overhead-press", sets: 3, reps: [8, 10], restSeconds: 90 },
          { exerciseId: "plank", sets: 3, reps: [30, 45], restSeconds: 45 },
        ],
      },
      {
        id: "bfb-b",
        name: "Full Body B",
        focus: "Charnière + tirage",
        exercises: [
          { exerciseId: "rdl", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "lat-pulldown", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "lunges", sets: 3, reps: [10, 12], restSeconds: 75 },
          { exerciseId: "bicep-curl", sets: 3, reps: [10, 15], restSeconds: 60 },
          { exerciseId: "tricep-pushdown", sets: 3, reps: [10, 15], restSeconds: 60 },
        ],
      },
      {
        id: "bfb-c",
        name: "Full Body C",
        focus: "Volume contrôlé",
        exercises: [
          { exerciseId: "squat", sets: 3, reps: [6, 10], restSeconds: 120 },
          { exerciseId: "bench-press", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "row", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "overhead-press", sets: 2, reps: [8, 10], restSeconds: 90 },
          { exerciseId: "plank", sets: 3, reps: [40, 60], restSeconds: 45 },
        ],
      },
    ],
  },
  {
    id: "muscle-strength",
    title: "Muscle & Strength",
    description: "Programme intermédiaire sur 15 semaines pour gagner muscle et force avec cardio bas.",
    level: "intermediate",
    weeks: 15,
    goals: ["build_muscle", "strength"],
    equipment: ["full_gym"],
    tags: ["Personnalisé", "Force"],
    days: [
      {
        id: "ms-upper",
        name: "Upper Strength",
        focus: "Haut du corps",
        exercises: [
          { exerciseId: "bench-press", sets: 4, reps: [6, 10], restSeconds: 120 },
          { exerciseId: "row", sets: 4, reps: [6, 10], restSeconds: 120 },
          { exerciseId: "overhead-press", sets: 3, reps: [6, 10], restSeconds: 90 },
          { exerciseId: "lat-pulldown", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "bicep-curl", sets: 3, reps: [10, 12], restSeconds: 60 },
          { exerciseId: "tricep-pushdown", sets: 3, reps: [10, 12], restSeconds: 60 },
        ],
      },
      {
        id: "ms-lower",
        name: "Lower Strength",
        focus: "Bas du corps",
        exercises: [
          { exerciseId: "squat", sets: 4, reps: [5, 8], restSeconds: 150 },
          { exerciseId: "rdl", sets: 3, reps: [6, 10], restSeconds: 120 },
          { exerciseId: "lunges", sets: 3, reps: [8, 12], restSeconds: 90 },
          { exerciseId: "plank", sets: 3, reps: [45, 60], restSeconds: 45 },
        ],
      },
    ],
  },
  {
    id: "home-keepfit",
    title: "Maison Remise en Forme",
    description: "Séances courtes avec haltères ou poids du corps pour rester régulier chez soi.",
    level: "beginner",
    weeks: 6,
    goals: ["keep_fit", "lose_weight"],
    equipment: ["home", "dumbbells", "bodyweight"],
    tags: ["Maison", "Cardio léger"],
    days: [
      {
        id: "hk-1",
        name: "Circuit A",
        focus: "Full body maison",
        exercises: [
          { exerciseId: "goblet-squat", sets: 3, reps: [12, 15], restSeconds: 60 },
          { exerciseId: "dumbbell-press", sets: 3, reps: [10, 12], restSeconds: 60 },
          { exerciseId: "lunges", sets: 3, reps: [10, 12], restSeconds: 60 },
          { exerciseId: "bicep-curl", sets: 3, reps: [12, 15], restSeconds: 45 },
          { exerciseId: "plank", sets: 3, reps: [30, 45], restSeconds: 40 },
        ],
      },
    ],
  },
  {
    id: "fat-loss",
    title: "Perte de Graisse Active",
    description: "Volume modéré, densités plus élevées et focus sur la régularité.",
    level: "beginner",
    weeks: 10,
    goals: ["lose_weight", "keep_fit"],
    equipment: ["full_gym", "machines"],
    tags: ["Perte de graisse"],
    days: [
      {
        id: "fl-1",
        name: "Full Body Densité",
        focus: "Densité",
        exercises: [
          { exerciseId: "goblet-squat", sets: 3, reps: [12, 15], restSeconds: 60 },
          { exerciseId: "lat-pulldown", sets: 3, reps: [10, 15], restSeconds: 60 },
          { exerciseId: "dumbbell-press", sets: 3, reps: [10, 15], restSeconds: 60 },
          { exerciseId: "seated-row", sets: 3, reps: [12, 15], restSeconds: 60 },
          { exerciseId: "lunges", sets: 3, reps: [12, 15], restSeconds: 45 },
          { exerciseId: "plank", sets: 3, reps: [40, 60], restSeconds: 40 },
        ],
      },
    ],
  },
];

export function getProgram(id: string) {
  return PROGRAMS.find((p) => p.id === id);
}

export function recommendPrograms(input: {
  level: FitnessLevel | null;
  goals: Goal[];
  equipment: Equipment[];
}) {
  const scored = PROGRAMS.map((p) => {
    let score = 0;
    if (input.level && p.level === input.level) score += 3;
    if (input.level === "beginner" && p.level === "beginner") score += 2;
    score += p.goals.filter((g) => input.goals.includes(g)).length * 2;
    score += p.equipment.filter((e) => input.equipment.includes(e)).length;
    return { program: p, score };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.program);
}
