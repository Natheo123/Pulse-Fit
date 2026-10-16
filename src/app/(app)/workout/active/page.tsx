"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import gsap from "gsap";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { ExerciseVideo } from "@/components/exercises/ExerciseVideo";
import { MuscleMap } from "@/components/muscles/MuscleMap";
import {
  IconBack,
  IconCheck,
  IconPause,
  IconPlay,
} from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { getExercise } from "@/lib/data/exercises";
import { useActiveSession, useAppStore } from "@/lib/store/useAppStore";

/**
 * Séance simplifiée :
 * 1) Un exercice à la fois
 * 2) Une seule série active (grosse)
 * 3) Un bouton clair « Valider »
 * 4) Repos plein écran, puis série / exo suivant auto
 */
export default function ActiveWorkoutPage() {
  const router = useRouter();
  const session = useActiveSession();
  const tickSession = useAppStore((s) => s.tickSession);
  const pauseSession = useAppStore((s) => s.pauseSession);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const updateSet = useAppStore((s) => s.updateSet);
  const completeSet = useAppStore((s) => s.completeSet);

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [restLeft, setRestLeft] = useState(0);
  const [restTotal, setRestTotal] = useState(90);
  const [help, setHelp] = useState<"none" | "video" | "muscles">("none");

  useEffect(() => {
    if (!session) router.replace("/workout");
  }, [session, router]);

  useEffect(() => {
    if (!session || session.status !== "active") return;
    const id = window.setInterval(() => tickSession(1), 1000);
    return () => window.clearInterval(id);
  }, [session, tickSession]);

  useEffect(() => {
    if (restLeft <= 0) return;
    const id = window.setInterval(() => setRestLeft((r) => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [restLeft]);

  // Avance auto vers le prochain exo si toutes les séries sont faites
  useEffect(() => {
    if (!session || restLeft > 0) return;
    const ex = session.exercises[exerciseIndex];
    if (!ex) return;
    if (ex.sets.every((s) => s.completed)) {
      if (exerciseIndex < session.exercises.length - 1) {
        const t = window.setTimeout(() => setExerciseIndex((i) => i + 1), 450);
        return () => window.clearTimeout(t);
      }
    }
  }, [session, exerciseIndex, restLeft]);

  const current = session?.exercises[exerciseIndex];
  const meta = current ? getExercise(current.exerciseId) : undefined;

  const activeSet = useMemo(() => {
    if (!current) return undefined;
    return current.sets.find((s) => !s.completed) ?? current.sets[current.sets.length - 1];
  }, [current]);

  const setDoneCount = current?.sets.filter((s) => s.completed).length ?? 0;
  const setTotal = current?.sets.length ?? 0;
  const allSetsDone = setDoneCount === setTotal && setTotal > 0;
  const isLastExercise =
    !!session && exerciseIndex >= session.exercises.length - 1;

  const progress = useMemo(() => {
    if (!session) return 0;
    const all = session.exercises.flatMap((e) => e.sets);
    const done = all.filter((s) => s.completed).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }, [session]);

  if (!session || !current || !meta || !activeSet) return null;

  function bump(field: "reps" | "weight", delta: number) {
    const next = Math.max(0, Math.round((activeSet![field] + delta) * 2) / 2);
    updateSet(current!.exerciseId, activeSet!.id, { [field]: next });
  }

  function onValidate() {
    if (activeSet!.completed) return;
    if (activeSet!.reps <= 0) {
      updateSet(current!.exerciseId, activeSet!.id, {
        reps: meta!.defaultReps[0],
      });
    }
    completeSet(current!.exerciseId, activeSet!.id);

    const remainingAfter =
      current!.sets.filter((s) => !s.completed && s.id !== activeSet!.id).length;

    if (remainingAfter > 0) {
      const rest = meta!.restSeconds;
      setRestTotal(rest);
      setRestLeft(rest);
      gsap.fromTo(
        ".rest-overlay",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }

  function goSummary() {
    router.push("/workout/summary");
  }

  // ——— Écran repos (plein focus) ———
  if (restLeft > 0) {
    return (
      <main className="rest-overlay flex min-h-dvh flex-col px-5 pb-8 pt-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Repos
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          Prochaine série · {meta.nameFr}
        </p>
        <div className="mt-10 flex flex-1 flex-col items-center justify-center">
          <p className="font-display text-7xl font-800 tabular-nums tracking-tight">
            {formatTime(restLeft)}
          </p>
          <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${((restTotal - restLeft) / Math.max(restTotal, 1)) * 100}%`,
              }}
            />
          </div>
          <div className="mt-8 flex gap-2">
            <Chip onClick={() => setRestLeft((r) => Math.max(0, r - 15))}>-15 s</Chip>
            <Chip onClick={() => setRestLeft(0)}>Passer</Chip>
            <Chip onClick={() => setRestLeft((r) => r + 15)}>+15 s</Chip>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-8 pt-5">
      {/* Header minimal */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/workout"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <IconBack size={20} />
        </Link>
        <div className="text-center">
          <p className="text-[11px] font-semibold text-accent">
            Exercice {exerciseIndex + 1}/{session.exercises.length}
          </p>
          <p className="font-mono text-xs tabular-nums text-muted">
            {formatTime(session.elapsedSeconds)}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            session.status === "paused" ? resumeSession() : pauseSession()
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          {session.status === "paused" ? (
            <IconPlay size={18} />
          ) : (
            <IconPause size={18} />
          )}
        </button>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimateIn key={`${current.exerciseId}-${activeSet.id}`} className="mt-5 flex flex-1 flex-col">
        <h1 className="font-display text-center text-2xl font-800 leading-tight">
          {meta.nameFr}
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted">
          Série {Math.min(setDoneCount + (allSetsDone ? 0 : 1), setTotal)}/{setTotal}
          {" · "}cible {meta.defaultReps[0]}–{meta.defaultReps[1]} reps
        </p>

        {/* Pastilles séries */}
        <div className="mt-4 flex justify-center gap-2">
          {current.sets.map((s) => (
            <span
              key={s.id}
              className={`h-2.5 w-8 rounded-full ${
                s.completed
                  ? "bg-accent"
                  : s.id === activeSet.id
                    ? "bg-accent/40"
                    : "bg-surface"
              }`}
            />
          ))}
        </div>

        {/* Gros panneau série */}
        {!allSetsDone ? (
          <div className="mt-6 rounded-[1.6rem] bg-surface p-5">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted">
              À faire maintenant
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <BigStepper
                label="Répétitions"
                value={activeSet.reps}
                onMinus={() => bump("reps", -1)}
                onPlus={() => bump("reps", 1)}
              />
              <BigStepper
                label="Charge (kg)"
                value={activeSet.weight}
                onMinus={() => bump("weight", -2.5)}
                onPlus={() => bump("weight", 2.5)}
              />
            </div>

            <button
              type="button"
              onClick={onValidate}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-800 text-accent-contrast shadow-[0_10px_32px_var(--pf-glow)]"
            >
              <IconCheck size={22} />
              Valider la série
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.6rem] border border-accent/30 bg-accent/10 p-5 text-center">
            <p className="font-display text-xl font-800">Exercice terminé ✓</p>
            <p className="mt-1 text-sm text-muted">
              {isLastExercise
                ? "Bravo — passe au bilan."
                : "Passe à l’exercice suivant."}
            </p>
          </div>
        )}

        {/* Aide optionnelle */}
        <div className="mt-4 flex justify-center gap-2">
          <Chip
            active={help === "video"}
            onClick={() => setHelp((h) => (h === "video" ? "none" : "video"))}
          >
            Voir la vidéo
          </Chip>
          <Chip
            active={help === "muscles"}
            onClick={() =>
              setHelp((h) => (h === "muscles" ? "none" : "muscles"))
            }
          >
            Muscles
          </Chip>
        </div>

        {help === "video" ? (
          <div className="mt-3">
            <ExerciseVideo
              demoUrl={meta.demoUrl}
              demoVideo={meta.demoVideo}
              videoId={meta.videoId}
              title={meta.nameFr}
              mode="loop"
            />
          </div>
        ) : null}
        {help === "muscles" ? (
          <div className="mt-3">
            <MuscleMap exerciseId={meta.id} loads={meta.muscleLoad} compact />
          </div>
        ) : null}

        <div className="mt-auto flex gap-2 pt-6">
          <Button
            variant="surface"
            disabled={exerciseIndex === 0}
            onClick={() => setExerciseIndex((i) => Math.max(0, i - 1))}
          >
            Retour
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              if (!isLastExercise) setExerciseIndex((i) => i + 1);
              else goSummary();
            }}
          >
            {isLastExercise ? "Voir le bilan" : "Exercice suivant"}
          </Button>
        </div>
      </AnimateIn>
    </main>
  );
}

function BigStepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="rounded-2xl bg-background px-2 py-4 text-center">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-2xl font-bold"
        >
          −
        </button>
        <span className="min-w-[3.2rem] font-display text-3xl font-800 tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={onPlus}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-2xl font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Chip({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-xs font-semibold ${
        active ? "bg-accent text-accent-contrast" : "bg-surface text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
