import type { PersonalRecord, WorkoutSession } from "./types";

export type AchievementCategory =
  | "milestones"
  | "consistency"
  | "strength"
  | "volume"
  | "explorer";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  /** Clé d’icône visuelle */
  icon: AchievementIcon;
  target: number;
  /** Couleur d’accent du badge */
  tone: "lime" | "blue" | "violet" | "orange" | "rose" | "cyan" | "gold";
}

export type AchievementIcon =
  | "flame"
  | "dumbbell"
  | "trophy"
  | "medal"
  | "calendar"
  | "bolt"
  | "target"
  | "compass"
  | "clock"
  | "star"
  | "mountain"
  | "zap";

export interface AchievementStatus extends AchievementDef {
  progress: number;
  unlocked: boolean;
  percent: number;
  unlockedAt?: string;
}

export const CATEGORY_FR: Record<AchievementCategory, string> = {
  milestones: "Jalons",
  consistency: "Assiduité",
  strength: "Force",
  volume: "Volume",
  explorer: "Explorateur",
};

export const ACHIEVEMENTS: AchievementDef[] = [
  // Jalons
  {
    id: "first-session",
    title: "Premier pas",
    description: "Terminer ta première séance.",
    category: "milestones",
    icon: "star",
    target: 1,
    tone: "gold",
  },
  {
    id: "sessions-5",
    title: "Dans le rythme",
    description: "Compléter 5 séances.",
    category: "milestones",
    icon: "medal",
    target: 5,
    tone: "lime",
  },
  {
    id: "sessions-10",
    title: "Habitué",
    description: "Compléter 10 séances.",
    category: "milestones",
    icon: "trophy",
    target: 10,
    tone: "blue",
  },
  {
    id: "sessions-25",
    title: "Athlète régulier",
    description: "Compléter 25 séances.",
    category: "milestones",
    icon: "mountain",
    target: 25,
    tone: "violet",
  },
  {
    id: "sessions-50",
    title: "Machine",
    description: "Compléter 50 séances.",
    category: "milestones",
    icon: "bolt",
    target: 50,
    tone: "orange",
  },
  {
    id: "sessions-100",
    title: "Légende",
    description: "Compléter 100 séances.",
    category: "milestones",
    icon: "trophy",
    target: 100,
    tone: "gold",
  },

  // Assiduité (semaines consécutives avec ≥1 séance — style Lyfta)
  {
    id: "streak-2",
    title: "Série de 2",
    description: "2 semaines d’affilée avec au moins une séance.",
    category: "consistency",
    icon: "flame",
    target: 2,
    tone: "orange",
  },
  {
    id: "streak-4",
    title: "Un mois fort",
    description: "4 semaines consécutives d’entraînement.",
    category: "consistency",
    icon: "flame",
    target: 4,
    tone: "rose",
  },
  {
    id: "streak-8",
    title: "Inarrêtable",
    description: "8 semaines de streak.",
    category: "consistency",
    icon: "calendar",
    target: 8,
    tone: "violet",
  },
  {
    id: "streak-12",
    title: "Quart de fer",
    description: "12 semaines sans manquer une semaine.",
    category: "consistency",
    icon: "flame",
    target: 12,
    tone: "gold",
  },
  {
    id: "days-7",
    title: "Semaine pleine",
    description: "S’entraîner 7 jours différents (pas forcément d’affilée).",
    category: "consistency",
    icon: "calendar",
    target: 7,
    tone: "cyan",
  },
  {
    id: "days-30",
    title: "Mois actif",
    description: "S’entraîner sur 30 jours différents.",
    category: "consistency",
    icon: "calendar",
    target: 30,
    tone: "blue",
  },

  // Force
  {
    id: "pr-1",
    title: "Record personnel",
    description: "Battre ton premier PR.",
    category: "strength",
    icon: "trophy",
    target: 1,
    tone: "gold",
  },
  {
    id: "pr-5",
    title: "Chasseur de PR",
    description: "Atteindre 5 records personnels.",
    category: "strength",
    icon: "medal",
    target: 5,
    tone: "orange",
  },
  {
    id: "pr-15",
    title: "Records en série",
    description: "15 records personnels suivis.",
    category: "strength",
    icon: "bolt",
    target: 15,
    tone: "rose",
  },
  {
    id: "heavy-100",
    title: "Centurion",
    description: "Soulever ≥ 100 kg sur un set.",
    category: "strength",
    icon: "dumbbell",
    target: 100,
    tone: "violet",
  },
  {
    id: "heavy-140",
    title: "Gros fer",
    description: "Soulever ≥ 140 kg sur un set.",
    category: "strength",
    icon: "dumbbell",
    target: 140,
    tone: "gold",
  },

  // Volume
  {
    id: "sets-50",
    title: "Volume starter",
    description: "Compléter 50 sets au total.",
    category: "volume",
    icon: "target",
    target: 50,
    tone: "lime",
  },
  {
    id: "sets-200",
    title: "Volume sérieux",
    description: "Compléter 200 sets.",
    category: "volume",
    icon: "target",
    target: 200,
    tone: "blue",
  },
  {
    id: "sets-500",
    title: "Usine à reps",
    description: "Compléter 500 sets.",
    category: "volume",
    icon: "zap",
    target: 500,
    tone: "violet",
  },
  {
    id: "tonnage-10k",
    title: "10 tonnes",
    description: "Atteindre 10 000 kg de volume total (poids × reps).",
    category: "volume",
    icon: "mountain",
    target: 10_000,
    tone: "orange",
  },
  {
    id: "tonnage-50k",
    title: "50 tonnes",
    description: "Atteindre 50 000 kg de volume cumulé.",
    category: "volume",
    icon: "mountain",
    target: 50_000,
    tone: "gold",
  },
  {
    id: "hours-5",
    title: "5 heures de fer",
    description: "Accumuler 5 heures d’entraînement.",
    category: "volume",
    icon: "clock",
    target: 5 * 3600,
    tone: "cyan",
  },
  {
    id: "hours-20",
    title: "20 heures",
    description: "Accumuler 20 heures d’entraînement.",
    category: "volume",
    icon: "clock",
    target: 20 * 3600,
    tone: "blue",
  },

  // Explorateur
  {
    id: "exercises-5",
    title: "Curieux",
    description: "Essayer 5 exercices différents.",
    category: "explorer",
    icon: "compass",
    target: 5,
    tone: "lime",
  },
  {
    id: "exercises-15",
    title: "Bibliothèque vivante",
    description: "Essayer 15 exercices différents.",
    category: "explorer",
    icon: "compass",
    target: 15,
    tone: "cyan",
  },
  {
    id: "exercises-40",
    title: "Collectionneur",
    description: "Essayer 40 exercices différents.",
    category: "explorer",
    icon: "star",
    target: 40,
    tone: "violet",
  },
  {
    id: "long-session",
    title: "Séance marathon",
    description: "Terminer une séance de plus de 60 minutes.",
    category: "explorer",
    icon: "clock",
    target: 3600,
    tone: "orange",
  },
  {
    id: "big-session",
    title: "Grosse session",
    description: "Compléter une séance avec au moins 20 sets.",
    category: "explorer",
    icon: "zap",
    target: 20,
    tone: "rose",
  },
];

function completedSessions(sessions: WorkoutSession[]) {
  return sessions.filter((s) => s.status === "completed");
}

/** Semaine ISO-ish lundi→dimanche (style Lyfta: ≥1 séance / semaine) */
function weekKey(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // monday=0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

export function computeWeeklyStreak(sessions: WorkoutSession[]) {
  const weeks = new Set(
    completedSessions(sessions).map((s) =>
      weekKey(new Date(s.completedAt ?? s.startedAt))
    )
  );
  if (!weeks.size) return 0;

  let streak = 0;
  const cursor = new Date();
  // Comme Lyfta: la semaine en cours peut être vide sans casser
  const thisWeek = weekKey(cursor);
  if (!weeks.has(thisWeek)) {
    cursor.setDate(cursor.getDate() - 7);
  }

  for (let i = 0; i < 104; i++) {
    const key = weekKey(cursor);
    if (weeks.has(key)) streak += 1;
    else break;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}

function uniqueTrainingDays(sessions: WorkoutSession[]) {
  return new Set(
    completedSessions(sessions).map((s) =>
      new Date(s.completedAt ?? s.startedAt).toDateString()
    )
  ).size;
}

function uniqueExercises(sessions: WorkoutSession[]) {
  const ids = new Set<string>();
  for (const s of completedSessions(sessions)) {
    for (const e of s.exercises) {
      if (e.sets.some((st) => st.completed)) ids.add(e.exerciseId);
    }
  }
  return ids.size;
}

function totalCompletedSets(sessions: WorkoutSession[]) {
  let n = 0;
  for (const s of completedSessions(sessions)) {
    for (const e of s.exercises) n += e.sets.filter((st) => st.completed).length;
  }
  return n;
}

function totalTonnage(sessions: WorkoutSession[]) {
  let t = 0;
  for (const s of completedSessions(sessions)) {
    for (const e of s.exercises) {
      for (const st of e.sets) {
        if (st.completed) t += st.weight * st.reps;
      }
    }
  }
  return Math.round(t);
}

function maxLift(sessions: WorkoutSession[]) {
  let max = 0;
  for (const s of completedSessions(sessions)) {
    for (const e of s.exercises) {
      for (const st of e.sets) {
        if (st.completed && st.weight > max) max = st.weight;
      }
    }
  }
  return max;
}

function totalElapsed(sessions: WorkoutSession[]) {
  return completedSessions(sessions).reduce(
    (acc, s) => acc + (s.elapsedSeconds || 0),
    0
  );
}

function maxSessionSets(sessions: WorkoutSession[]) {
  let max = 0;
  for (const s of completedSessions(sessions)) {
    const n = s.exercises.reduce(
      (acc, e) => acc + e.sets.filter((st) => st.completed).length,
      0
    );
    if (n > max) max = n;
  }
  return max;
}

function maxSessionDuration(sessions: WorkoutSession[]) {
  return completedSessions(sessions).reduce(
    (acc, s) => Math.max(acc, s.elapsedSeconds || 0),
    0
  );
}

function progressFor(
  id: string,
  sessions: WorkoutSession[],
  records: PersonalRecord[]
): number {
  const done = completedSessions(sessions).length;
  switch (id) {
    case "first-session":
    case "sessions-5":
    case "sessions-10":
    case "sessions-25":
    case "sessions-50":
    case "sessions-100":
      return done;
    case "streak-2":
    case "streak-4":
    case "streak-8":
    case "streak-12":
      return computeWeeklyStreak(sessions);
    case "days-7":
    case "days-30":
      return uniqueTrainingDays(sessions);
    case "pr-1":
    case "pr-5":
    case "pr-15":
      return records.length;
    case "heavy-100":
    case "heavy-140":
      return maxLift(sessions);
    case "sets-50":
    case "sets-200":
    case "sets-500":
      return totalCompletedSets(sessions);
    case "tonnage-10k":
    case "tonnage-50k":
      return totalTonnage(sessions);
    case "hours-5":
    case "hours-20":
      return totalElapsed(sessions);
    case "exercises-5":
    case "exercises-15":
    case "exercises-40":
      return uniqueExercises(sessions);
    case "long-session":
      return maxSessionDuration(sessions);
    case "big-session":
      return maxSessionSets(sessions);
    default:
      return 0;
  }
}

function unlockedAtFor(
  def: AchievementDef,
  sessions: WorkoutSession[],
  records: PersonalRecord[]
): string | undefined {
  if (progressFor(def.id, sessions, records) < def.target) return undefined;

  if (def.id.startsWith("pr-")) {
    const sorted = [...records].sort(
      (a, b) =>
        new Date(a.achievedAt).getTime() - new Date(b.achievedAt).getTime()
    );
    const hit = sorted[def.target - 1];
    return hit?.achievedAt;
  }

  const completed = [...completedSessions(sessions)].sort(
    (a, b) =>
      new Date(a.completedAt ?? a.startedAt).getTime() -
      new Date(b.completedAt ?? b.startedAt).getTime()
  );

  if (def.id.startsWith("sessions-") || def.id === "first-session") {
    return completed[def.target - 1]?.completedAt ?? completed[def.target - 1]?.startedAt;
  }

  // Approximation: date de la dernière séance quand le seuil est atteint
  return completed.at(-1)?.completedAt ?? completed.at(-1)?.startedAt;
}

export function evaluateAchievements(
  sessions: WorkoutSession[],
  records: PersonalRecord[]
): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => {
    const progress = progressFor(def.id, sessions, records);
    const unlocked = progress >= def.target;
    return {
      ...def,
      progress: Math.min(progress, def.target),
      unlocked,
      percent: Math.min(100, Math.round((progress / def.target) * 100)),
      unlockedAt: unlocked
        ? unlockedAtFor(def, sessions, records)
        : undefined,
    };
  });
}

export function formatAchievementProgress(a: AchievementStatus) {
  if (a.id.startsWith("hours-")) {
    const cur = Math.floor(a.progress / 3600);
    const tgt = Math.floor(a.target / 3600);
    return `${cur} / ${tgt} h`;
  }
  if (a.id === "long-session") {
    return `${Math.floor(a.progress / 60)} / ${Math.floor(a.target / 60)} min`;
  }
  if (a.id.startsWith("tonnage-")) {
    return `${a.progress.toLocaleString("fr-FR")} / ${a.target.toLocaleString("fr-FR")} kg`;
  }
  if (a.id.startsWith("heavy-")) {
    return `${a.progress} / ${a.target} kg`;
  }
  return `${a.progress} / ${a.target}`;
}
