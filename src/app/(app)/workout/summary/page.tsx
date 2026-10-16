"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import {
  aggregateExerciseFascicles,
  MuscleMap,
} from "@/components/muscles/MuscleMap";
import { IconBack, IconCheck } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { getExercise } from "@/lib/data/exercises";
import { useActiveSession, useAppStore } from "@/lib/store/useAppStore";

export default function WorkoutSummaryPage() {
  const router = useRouter();
  const active = useActiveSession();
  const sessions = useAppStore((s) => s.sessions);
  const lastFinishedSessionId = useAppStore((s) => s.lastFinishedSessionId);
  const updateSet = useAppStore((s) => s.updateSet);
  const finishSession = useAppStore((s) => s.finishSession);
  const recommendations = useAppStore((s) => s.recommendations);
  const decideRecommendation = useAppStore((s) => s.decideRecommendation);

  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const session = active ?? sessions.find((s) => s.id === confirmedId || s.id === lastFinishedSessionId);

  useEffect(() => {
    if (!active && !confirmedId && !lastFinishedSessionId) {
      router.replace("/workout");
    }
  }, [active, confirmedId, lastFinishedSessionId, router]);

  const fascicleLoads = useMemo(() => {
    if (!session) return {};
    return aggregateExerciseFascicles(
      session.exercises.map((e) => ({
        id: e.exerciseId,
        muscleLoad: getExercise(e.exerciseId)?.muscleLoad,
      }))
    );
  }, [session]);

  const recsForSession = useMemo(() => {
    if (!confirmedId && !lastFinishedSessionId) return [];
    const id = confirmedId ?? lastFinishedSessionId;
    return recommendations.filter((r) => r.basedOnSessionId === id);
  }, [recommendations, confirmedId, lastFinishedSessionId]);

  if (!session) return null;

  const editable = !!active && session.id === active.id;

  const volume = session.exercises.reduce(
    (a, ex) =>
      a +
      ex.sets.reduce(
        (b, st) => b + (st.reps > 0 ? st.weight * st.reps : 0),
        0
      ),
    0
  );

  function confirm() {
    const id = finishSession();
    if (id) setConfirmedId(id);
  }

  return (
    <main className="px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <Link
          href={editable ? "/workout/active" : "/workout"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <IconBack size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-700">
            {editable ? "Bilan de séance" : "Séance terminée"}
          </h1>
          <p className="text-sm text-muted">{session.title}</p>
        </div>
      </div>

      <AnimateIn className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface p-4">
          <p className="text-xs text-muted">Durée</p>
          <p className="font-display mt-1 text-xl font-700">
            {Math.floor(session.elapsedSeconds / 60)} min
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-4">
          <p className="text-xs text-muted">Volume</p>
          <p className="font-display mt-1 text-xl font-700">
            {Math.round(volume)} kg
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.08} className="mt-4">
        <MuscleMap fascicleLoads={fascicleLoads} />
      </AnimateIn>

      <AnimateIn delay={0.12} className="mt-6">
        <h2 className="font-display text-lg font-700">
          {editable
            ? "Vérifie / complète tes stats"
            : "Performances enregistrées"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Indique le poids et les reps réellement faits — PulseFit calcule s’il
          faut monter ou baisser la charge.
        </p>

        <div className="mt-4 space-y-4">
          {session.exercises.map((ex) => {
            const meta = getExercise(ex.exerciseId);
            return (
              <div key={ex.exerciseId} className="rounded-[1.35rem] bg-surface p-4">
                <p className="font-semibold">{meta?.nameFr ?? ex.exerciseId}</p>
                <p className="text-xs text-muted">
                  Cible {meta?.defaultReps[0]}–{meta?.defaultReps[1]} reps
                </p>
                <div className="mt-3 space-y-2">
                  {ex.sets.map((st) => (
                    <div
                      key={st.id}
                      className="grid grid-cols-[2rem_1fr_1fr_auto] items-center gap-2"
                    >
                      <span className="text-center text-sm font-bold text-muted">
                        {st.setNumber}
                      </span>
                      {editable ? (
                        <>
                          <label className="rounded-xl bg-background px-2 py-2">
                            <span className="block text-[10px] text-muted">Reps</span>
                            <input
                              type="number"
                              value={st.reps}
                              onChange={(e) =>
                                updateSet(ex.exerciseId, st.id, {
                                  reps: Number(e.target.value),
                                  completed: Number(e.target.value) > 0,
                                })
                              }
                              className="w-full bg-transparent font-display text-lg font-700 outline-none"
                            />
                          </label>
                          <label className="rounded-xl bg-background px-2 py-2">
                            <span className="block text-[10px] text-muted">Kg</span>
                            <input
                              type="number"
                              step={0.5}
                              value={st.weight}
                              onChange={(e) =>
                                updateSet(ex.exerciseId, st.id, {
                                  weight: Number(e.target.value),
                                })
                              }
                              className="w-full bg-transparent font-display text-lg font-700 outline-none"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <span className="rounded-xl bg-background px-3 py-2 text-sm">
                            {st.reps} reps
                          </span>
                          <span className="rounded-xl bg-background px-3 py-2 text-sm">
                            {st.weight} kg
                          </span>
                        </>
                      )}
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                          st.completed || st.reps > 0
                            ? "bg-accent/20 text-accent"
                            : "bg-background text-muted"
                        }`}
                      >
                        <IconCheck size={14} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AnimateIn>

      {editable ? (
        <div className="mt-6 space-y-3">
          <Button variant="accent" onClick={confirm}>
            Valider et calculer la progression
          </Button>
          <Button variant="ghost" onClick={() => router.push("/workout/active")}>
            Reprendre la séance
          </Button>
        </div>
      ) : (
        <AnimateIn delay={0.16} className="mt-6 space-y-3">
          <h2 className="font-display text-lg font-700">
            Recommandations de charge
          </h2>
          {recsForSession.length === 0 ? (
            <p className="text-sm text-muted">
              Pas assez de séries complètes pour une recommandation. La prochaine
              fois, renseigne au moins 2 séries par exercice.
            </p>
          ) : (
            recsForSession.map((r) => {
              const ex = getExercise(r.exerciseId);
              return (
                <div key={r.id} className="rounded-[1.35rem] bg-surface p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{ex?.nameFr}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        r.action === "increase"
                          ? "bg-accent text-accent-contrast"
                          : r.action === "decrease"
                            ? "bg-danger/20 text-danger"
                            : "bg-background text-muted"
                      }`}
                    >
                      {r.action === "increase"
                        ? `+ → ${r.suggestedWeight} kg`
                        : r.action === "decrease"
                          ? `↓ → ${r.suggestedWeight} kg`
                          : `= ${r.suggestedWeight} kg`}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {r.explanation}
                  </p>
                  {!r.userDecision ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => decideRecommendation(r.id, "accepted")}
                        className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-contrast"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => decideRecommendation(r.id, "rejected")}
                        className="rounded-xl bg-background px-4 py-2.5 text-sm"
                      >
                        Garder ma charge
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-accent">
                      Noté : {r.userDecision}
                    </p>
                  )}
                </div>
              );
            })
          )}
          <Button onClick={() => router.push("/home")}>Retour à l&apos;accueil</Button>
        </AnimateIn>
      )}
    </main>
  );
}
