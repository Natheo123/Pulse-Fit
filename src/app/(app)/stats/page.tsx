"use client";

import { useMemo, useState } from "react";
import { AmbientGlow, AnimateIn } from "@/components/gsap/AnimateIn";
import { ProgressChart } from "@/components/charts/ProgressChart";
import {
  MuscleMap,
  aggregateExerciseFascicles,
} from "@/components/muscles/MuscleMap";
import { getExercise } from "@/lib/data/exercises";
import { useAppStore } from "@/lib/store/useAppStore";

const ranges = ["Sem.", "Mois", "6m", "An"] as const;

export default function StatsPage() {
  const sessions = useAppStore((s) => s.sessions);
  const records = useAppStore((s) => s.records);
  const recommendations = useAppStore((s) => s.recommendations);
  const decideRecommendation = useAppStore((s) => s.decideRecommendation);
  const [range, setRange] = useState<(typeof ranges)[number]>("An");

  const completed = sessions.filter((s) => s.status === "completed");
  const volume = useMemo(() => {
    return completed.reduce((sum, sess) => {
      return (
        sum +
        sess.exercises.reduce(
          (a, ex) =>
            a +
            ex.sets
              .filter((st) => st.completed)
              .reduce((b, st) => b + st.weight * st.reps, 0),
          0
        )
      );
    }, 0);
  }, [completed]);

  const fascicleLoads = useMemo(() => {
    const recent = completed.slice(0, 5);
    return aggregateExerciseFascicles(
      recent.flatMap((s) =>
        s.exercises.map((e) => ({
          id: e.exerciseId,
          muscleLoad: getExercise(e.exerciseId)?.muscleLoad,
        }))
      )
    );
  }, [completed]);

  const chartSeries = useMemo(() => {
    const last = completed.slice(0, 8).reverse();
    if (!last.length) {
      return [16, 18, 19, 21, 22, 23, 24, 25].map((v, i) => ({
        label: `${i + 1}`,
        value: v,
      }));
    }
    return last.map((s) => {
      const weights = s.exercises.flatMap((e) =>
        e.sets.filter((x) => x.completed).map((x) => x.weight)
      );
      const d = new Date(s.completedAt ?? s.startedAt);
      return {
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        value: weights.length ? Math.max(...weights) : 20,
      };
    });
  }, [completed]);

  const topRecord = records[0];
  const topEx = topRecord ? getExercise(topRecord.exerciseId) : undefined;

  return (
    <main className="pf-mesh relative px-4 pb-6 pt-7">
      <AmbientGlow />

      <AnimateIn className="relative flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Performance
          </p>
          <h1 className="font-display mt-1 text-3xl font-800 tracking-tight">
            Stats
          </h1>
        </div>
        <div className="flex gap-0.5 rounded-2xl border border-border/60 bg-surface/80 p-1 backdrop-blur">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition ${
                range === r
                  ? "bg-accent text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </AnimateIn>

      <AnimateIn delay={0.06} className="relative mt-5">
        <div className="pf-card-accent pf-shimmer overflow-hidden rounded-[1.5rem] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                Force estimée
              </p>
              <p className="font-display mt-1.5 text-4xl font-800 italic leading-none tracking-tight">
                {topRecord
                  ? `${topRecord.weight}–${topRecord.estimated1rm}`
                  : "19–25"}
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                kg · {topEx?.nameFr ?? "1RM estimé"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-[1.1rem] border border-border/50 bg-background/55 px-3 py-2.5 backdrop-blur">
                <p className="font-display text-xl font-800 leading-none">
                  {completed.length}
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-muted">
                  séances
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-border/50 bg-background/55 px-3 py-2.5 backdrop-blur">
                <p className="font-display text-xl font-800 leading-none">
                  {Math.round(volume / 1000) || 0}k
                </p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-muted">
                  volume
                </p>
              </div>
            </div>
          </div>

        </div>
      </AnimateIn>

      <AnimateIn delay={0.08} className="relative mt-3">
        <ProgressChart points={chartSeries} unit="kg" height={190} />
      </AnimateIn>

      {topRecord ? (
        <AnimateIn delay={0.1} className="relative mt-3">
          <div className="flex items-center justify-between rounded-[1.25rem] bg-accent px-4 py-3 text-accent-contrast shadow-[0_8px_28px_var(--pf-glow)]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
                Record perso
              </p>
              <p className="mt-0.5 text-sm font-semibold opacity-80">
                {topEx?.nameFr ?? "Exercice"}
              </p>
            </div>
            <span className="font-display text-2xl font-800 tabular-nums">
              {topRecord.weight} kg × {topRecord.reps}
            </span>
          </div>
        </AnimateIn>
      ) : null}

      <AnimateIn delay={0.12} className="relative mt-4">
        <div className="pf-card overflow-hidden rounded-[1.4rem] p-3.5">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Charge musculaire
          </p>
          <MuscleMap fascicleLoads={fascicleLoads} compact />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.16} className="relative mt-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-800">Progression</h2>
          <p className="text-[11px] text-muted">Conseils de charge</p>
        </div>
        <div className="mt-2.5 space-y-2">
          {recommendations.length === 0 ? (
            <p className="pf-card rounded-[1.25rem] px-4 py-3.5 text-xs leading-relaxed text-muted">
              Termine une séance pour des conseils de charge personnalisés.
            </p>
          ) : (
            recommendations.slice(0, 4).map((r) => {
              const ex = getExercise(r.exerciseId);
              return (
                <div
                  key={r.id}
                  className="pf-card rounded-[1.25rem] px-3.5 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {ex?.nameFr ?? r.exerciseId}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        r.action === "increase"
                          ? "bg-accent text-accent-contrast"
                          : r.action === "decrease"
                            ? "bg-danger/20 text-danger"
                            : "bg-background text-muted"
                      }`}
                    >
                      {r.action === "increase"
                        ? `↑ ${r.suggestedWeight}kg`
                        : r.action === "decrease"
                          ? `↓ ${r.suggestedWeight}kg`
                          : `= ${r.suggestedWeight}kg`}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted">
                    {r.explanation}
                  </p>
                  {!r.userDecision ? (
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => decideRecommendation(r.id, "accepted")}
                        className="flex-1 rounded-full bg-accent py-2 text-[11px] font-bold text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                      >
                        Appliquer
                      </button>
                      <button
                        type="button"
                        onClick={() => decideRecommendation(r.id, "rejected")}
                        className="rounded-full border border-border bg-background/60 px-4 py-2 text-[11px] font-semibold"
                      >
                        Non
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2} className="relative mt-5">
        <h2 className="font-display text-lg font-800">Historique</h2>
        <div className="mt-2.5 space-y-2">
          {completed.length === 0 ? (
            <p className="pf-card rounded-[1.25rem] px-4 py-3.5 text-xs text-muted">
              Aucune séance terminée.
            </p>
          ) : (
            completed.slice(0, 8).map((s) => (
              <div
                key={s.id}
                className="pf-card flex items-center justify-between rounded-[1.25rem] px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {new Date(s.completedAt ?? s.startedAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-700 tabular-nums text-accent">
                  {Math.floor(s.elapsedSeconds / 60)}m
                </p>
              </div>
            ))
          )}
        </div>
      </AnimateIn>
    </main>
  );
}
