import type { FitnessLevel, Goal, ProgressionRecommendation, WorkoutSession } from "./types";

type CoachContext = {
  name?: string;
  level?: FitnessLevel | null;
  goals?: Goal[];
  sessions: WorkoutSession[];
  recommendations: ProgressionRecommendation[];
};

const GOAL_FR: Record<Goal, string> = {
  lose_weight: "perdre du gras",
  build_muscle: "prendre du muscle",
  keep_fit: "rester en forme",
  strength: "gagner en force",
};

function completedSessions(sessions: WorkoutSession[]) {
  return sessions.filter((s) => s.status === "completed");
}

/** Coach local (sans API externe) — réponses basées sur le profil & l’historique */
export function localCoachReply(question: string, ctx: CoachContext): string {
  const q = question.toLowerCase();
  const name = ctx.name?.split(" ")[0] || "athlète";
  const done = completedSessions(ctx.sessions);
  const level = ctx.level ?? "beginner";
  const goals =
    ctx.goals?.map((g) => GOAL_FR[g]).join(", ") || "progression générale";
  const lastRec = ctx.recommendations.find((r) => !r.userDecision);

  if (/bonjour|salut|hello|hey/.test(q)) {
    return `Salut ${name} ! Prêt pour ta prochaine séance ? Tu as ${done.length} séance(s) terminée(s). Objectif : ${goals}.`;
  }

  if (/début|debut|commenc|aujourd/.test(q)) {
    if (level === "beginner") {
      return `Comme tu débutes, vise une séance full body courte : squat goblet, développé haltères, rowing, planche. 3×8–12, repos 60–90 s. Qualité > charge.`;
    }
    return `Aujourd’hui : reprends ton programme actif, monte en charge seulement si les séries cibles sont clean. Échauffe 5–8 min avant.`;
  }

  if (/remplac|machine|prise|alternative|variante/.test(q)) {
    return `Si le développé couché est pris : développé haltères, pompes lestées ou machine chest press. Même schéma de séries. Garde le même repos.`;
  }

  if (/analys|progress|séance|seance|pr\b|record/.test(q)) {
    if (!done.length) {
      return `Pas encore de séances enregistrées. Termine ta première, je pourrai commenter volume et tendance.`;
    }
    const last = done[0];
    const sets = last.exercises.reduce(
      (n, e) => n + e.sets.filter((s) => s.completed).length,
      0
    );
    let tip = `Dernière séance « ${last.title} » : ${sets} sets complétés.`;
    if (lastRec) {
      tip += `\n\nReco PulseFit : ${lastRec.explanation} (${lastRec.action} → ${lastRec.suggestedWeight} kg).`;
    } else {
      tip += `\n\nContinue sur le même rythme 1–2 semaines avant d’augmenter la charge.`;
    }
    return tip;
  }

  if (/nutrition|manger|protéine|calorie|repas/.test(q)) {
    return `Pour ${goals} : vise ~1,6–2,2 g de protéines / kg de poids de corps, des glucides autour des séances, et de l’eau. Le détail repas est dans l’onglet Nutrition.`;
  }

  if (/repos|récup|recup|douleur|courbature/.test(q)) {
    return `Courbatures OK si elles baissent en 48–72 h. Douleur articulaire vive → stoppe le mouvement et réduis l’amplitude. Entre séances du même muscle : 48 h mini.`;
  }

  return `Je suis le coach PulseFit (local, sans cloud). Tu es en niveau ${level}, objectif : ${goals}, ${done.length} séances loguées.\n\nDemande-moi : quoi faire aujourd’hui, une alternative d’exo, une analyse de tes séances, ou un conseil nutrition.`;
}
