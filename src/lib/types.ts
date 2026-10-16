export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type Goal = "lose_weight" | "build_muscle" | "keep_fit" | "strength";
export type Equipment = "full_gym" | "dumbbells" | "machines" | "home" | "bodyweight";
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "glutes"
  | "core"
  | "full_body";

export type AccentColor = "lime" | "blue" | "violet" | "orange" | "rose" | "cyan";
export type ThemeMode = "dark" | "light";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  onboardingComplete: boolean;
  level: FitnessLevel | null;
  goals: Goal[];
  equipment: Equipment[];
  daysPerWeek: number;
  sessionMinutes: number;
  limitations: string;
  createdAt: string;
}

export interface ThemePrefs {
  mode: ThemeMode;
  accent: AccentColor;
  unit: "kg" | "lb";
}

export interface Exercise {
  id: string;
  name: string;
  nameFr: string;
  muscles: MuscleGroup[];
  /** Intensité relative par muscle (0–1) pour la carte corporelle */
  muscleLoad?: Partial<Record<MuscleGroup, number>>;
  equipment: Equipment[];
  level: FitnessLevel;
  instructions: string[];
  commonMistakes: string[];
  variants: { easier?: string; harder?: string };
  defaultSets: number;
  defaultReps: [number, number];
  restSeconds: number;
  incrementKg: number;
  /** Miniature illustration style Lyfta */
  demoUrl?: string;
  /** Petite vidéo démo 3D (boucle muette, style Lyfta / Gymvisual) */
  demoVideo?: string;
  /** Tutoriel YouTube optionnel (lecteur complet) */
  videoId?: string;
}

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: [number, number];
  restSeconds: number;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string;
  exercises: ProgramExercise[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  level: FitnessLevel;
  weeks: number;
  goals: Goal[];
  equipment: Equipment[];
  days: WorkoutDay[];
  tags: string[];
}

export type SessionStatus = "active" | "paused" | "completed" | "abandoned";

export interface LoggedSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  rir?: number;
  completed: boolean;
  completedAt?: string;
}

export interface SessionExerciseLog {
  exerciseId: string;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  programId?: string;
  dayId?: string;
  title: string;
  status: SessionStatus;
  startedAt: string;
  pausedAt?: string;
  completedAt?: string;
  elapsedSeconds: number;
  exercises: SessionExerciseLog[];
  syncStatus: "pending" | "synced";
}

export type ProgressionAction = "increase" | "maintain" | "decrease";

export interface ProgressionRecommendation {
  id: string;
  exerciseId: string;
  action: ProgressionAction;
  currentWeight: number;
  suggestedWeight: number;
  explanation: string;
  ruleId: string;
  basedOnSessionId: string;
  createdAt: string;
  userDecision?: "accepted" | "rejected" | "modified";
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  estimated1rm: number;
  achievedAt: string;
  sessionId: string;
}
