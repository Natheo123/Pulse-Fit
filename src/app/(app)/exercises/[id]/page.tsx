"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { ExerciseVideo } from "@/components/exercises/ExerciseVideo";
import { MuscleMap } from "@/components/muscles/MuscleMap";
import { IconBack } from "@/components/icons/Icons";
import { getExercise } from "@/lib/data/exercises";
import { useAppStore } from "@/lib/store/useAppStore";

type Tab = "about" | "progress";

export default function ExerciseDetailPage() {
  const params = useParams<{ id: string }>();
  const exercise = getExercise(params.id);
  const sessions = useAppStore((s) => s.sessions);
  const records = useAppStore((s) => s.records);
  const record = records.find((r) => r.exerciseId === params.id);
  const [tab, setTab] = useState<Tab>("about");

  const historyPoints = useMemo(() => {
    const completed = sessions
      .filter((s) => s.status === "completed")
      .slice()
      .reverse();

    const pts: { label: string; value: number }[] = [];
    for (const s of completed) {
      const ex = s.exercises.find((e) => e.exerciseId === params.id);
      if (!ex) continue;
      const weights = ex.sets
        .filter((st) => st.completed && st.weight > 0)
        .map((st) => st.weight);
      if (!weights.length) continue;
      const d = new Date(s.completedAt ?? s.startedAt);
      pts.push({
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        value: Math.max(...weights),
      });
    }
    return pts.slice(-8);
  }, [sessions, params.id]);

  if (!exercise) {
    return (
      <main className="px-5 pt-10">
        <p>Exercice introuvable.</p>
        <Link href="/exercises" className="text-accent">
          Retour
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-8">
      {/* Hero vidéo loop style Lyfta */}
      <div className="relative">
        <ExerciseVideo
          demoUrl={exercise.demoUrl}
          demoVideo={exercise.demoVideo}
          videoId={exercise.videoId}
          title={exercise.nameFr}
          mode="loop"
          className="rounded-none"
        />
        <Link
          href="/exercises"
          className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
        >
          <IconBack size={20} />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent px-5 pb-4 pt-20">
          <h1 className="pf-title text-2xl text-foreground">{exercise.nameFr}</h1>
          <p className="mt-0.5 text-sm text-muted">{exercise.name}</p>
        </div>
      </div>

      <div className="px-5">
        <AnimateIn className="mt-3 flex flex-wrap gap-2">
          {exercise.muscles.map((m) => (
            <span
              key={m}
              className="rounded-full bg-accent/15 px-3 py-1 text-xs font-800 capitalize text-accent"
            >
              {m}
            </span>
          ))}
          <span className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
            {exercise.defaultSets}×{exercise.defaultReps[0]}–
            {exercise.defaultReps[1]}
          </span>
        </AnimateIn>

        {/* Tabs Lyfta-like */}
        <div className="mt-5 flex gap-1 rounded-2xl bg-surface p-1">
          {(
            [
              { id: "about", label: "À propos" },
              { id: "progress", label: "Progression" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-800 transition ${
                tab === t.id
                  ? "bg-accent text-accent-contrast"
                  : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "about" ? (
          <div className="mt-5 space-y-5">
            <AnimateIn>
              <ExerciseVideo
                demoUrl={exercise.demoUrl}
                demoVideo={exercise.demoVideo}
                videoId={exercise.videoId}
                title={exercise.nameFr}
                mode="player"
              />
              <p className="mt-2 text-center text-[11px] text-muted">
                Démo technique · tutoriel vidéo optionnel
              </p>
            </AnimateIn>

            <AnimateIn delay={0.06}>
              <MuscleMap exerciseId={exercise.id} loads={exercise.muscleLoad} />
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h2 className="pf-title text-lg">Instructions</h2>
              <ol className="mt-3 space-y-2">
                {exercise.instructions.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-2xl pf-card px-4 py-3 text-sm"
                  >
                    <span className="font-800 text-accent">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </AnimateIn>

            <AnimateIn delay={0.14}>
              <h2 className="pf-title text-lg">Erreurs fréquentes</h2>
              <ul className="mt-3 space-y-2">
                {exercise.commonMistakes.map((m) => (
                  <li
                    key={m}
                    className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </AnimateIn>

            <AnimateIn delay={0.18} className="rounded-2xl pf-card p-4 text-sm">
              <p>
                Cible : {exercise.defaultSets} séries ·{" "}
                {exercise.defaultReps[0]}–{exercise.defaultReps[1]} reps · repos{" "}
                {exercise.restSeconds}s
              </p>
              <p className="mt-1 text-muted">
                Incrément suggéré : {exercise.incrementKg || "—"} kg
              </p>
            </AnimateIn>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {record ? (
              <AnimateIn className="rounded-[1.35rem] bg-accent px-4 py-3.5 text-accent-contrast">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-800 uppercase tracking-wider opacity-70">
                      Personal Record
                    </p>
                    <p className="font-display mt-0.5 text-2xl font-800">
                      {record.weight} kg × {record.reps}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-800 uppercase tracking-wider opacity-70">
                      1RM est.
                    </p>
                    <p className="font-display mt-0.5 text-xl font-800">
                      {record.estimated1rm} kg
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ) : null}

            <AnimateIn delay={0.06}>
              <ProgressChart
                points={historyPoints}
                unit="kg"
                height={200}
              />
              {!historyPoints.length ? (
                <p className="mt-2 text-center text-xs text-muted">
                  Exemple de courbe — valide des séries pour voir ta vraie
                  progression.
                </p>
              ) : null}
            </AnimateIn>

            <AnimateIn delay={0.1} className="rounded-[1.35rem] pf-card p-4">
              <p className="text-[10px] font-800 uppercase tracking-wider text-muted">
                Historique récent
              </p>
              {historyPoints.length ? (
                <ul className="mt-3 space-y-2">
                  {[...historyPoints].reverse().map((p, i) => (
                    <li
                      key={`${p.label}-${i}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted">{p.label}</span>
                      <span className="font-800 tabular-nums">{p.value} kg</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  Pas encore de séries loggées pour cet exercice.
                </p>
              )}
            </AnimateIn>
          </div>
        )}
      </div>
    </main>
  );
}
