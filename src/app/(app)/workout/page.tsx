"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AmbientGlow,
  AnimateIn,
  PulseRing,
  useStaggerIn,
} from "@/components/gsap/AnimateIn";
import {
  IconCalendar,
  IconChevron,
  IconDumbbell,
  IconMuscle,
  IconPlay,
  IconPlus,
} from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { getExercise } from "@/lib/data/exercises";
import { getProgram } from "@/lib/data/programs";
import { useActiveSession, useAppStore } from "@/lib/store/useAppStore";

export default function WorkoutHubPage() {
  const router = useRouter();
  const activeProgramId = useAppStore((s) => s.activeProgramId);
  const startSession = useAppStore((s) => s.startSession);
  const resumeSession = useAppStore((s) => s.resumeSession);
  const customWorkouts = useAppStore((s) => s.customWorkouts);
  const active = useActiveSession();
  const program = activeProgramId ? getProgram(activeProgramId) : undefined;
  const day = program?.days[0];
  const listRef = useStaggerIn("[data-ex-row]", [day?.id]);

  function start() {
    if (!program || !day) {
      router.push("/plans");
      return;
    }
    startSession({
      programId: program.id,
      dayId: day.id,
      title: day.name,
    });
    router.push("/workout/active");
  }

  function continueActive() {
    if (active?.status === "paused") resumeSession();
    router.push("/workout/active");
  }

  const estMin = day
    ? Math.round(
        day.exercises.reduce(
          (s, e) => s + e.sets * 45 + (e.restSeconds ?? 60) * e.sets,
          0
        ) / 60
      )
    : 0;

  return (
    <main className="pf-mesh relative px-5 pb-6 pt-8">
      <AmbientGlow />

      <AnimateIn>
        <p className="pf-eyebrow">Entraînement</p>
        <h1 className="pf-title mt-1.5 text-3xl">Séance</h1>
        <p className="mt-1.5 text-sm text-muted">
          Lance, valide série par série, puis vois ton bilan.
        </p>
      </AnimateIn>

      {active && active.status !== "completed" ? (
        <AnimateIn delay={0.06} className="mt-6">
          <div className="pf-card-accent relative overflow-hidden rounded-[1.5rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              En cours
            </p>
            <h2 className="mt-2 font-display text-xl font-700">{active.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {active.status === "paused" ? "En pause" : "Active"} ·{" "}
              {formatTime(active.elapsedSeconds)}
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={continueActive} variant="accent">
                Reprendre
              </Button>
              <Button variant="ghost" onClick={() => router.push("/workout/summary")}>
                Bilan
              </Button>
            </div>
          </div>
        </AnimateIn>
      ) : null}

      <AnimateIn delay={0.1} className="mt-5 grid grid-cols-2 gap-2.5">
        <Link
          href="/workout/create"
          className="pf-card flex flex-col rounded-[1.3rem] p-4"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-contrast">
            <IconPlus size={20} />
          </span>
          <p className="mt-3 text-sm font-700">Créer</p>
          <p className="text-[11px] text-muted">Séance libre</p>
        </Link>
        <Link
          href="/exercises"
          className="pf-card flex flex-col rounded-[1.3rem] p-4"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <IconMuscle size={20} />
          </span>
          <p className="mt-3 text-sm font-700">Exercices</p>
          <p className="text-[11px] text-muted">Catalogue + vidéos</p>
        </Link>
        <Link
          href="/plans"
          className="pf-card flex flex-col rounded-[1.3rem] p-4"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <IconCalendar size={20} />
          </span>
          <p className="mt-3 text-sm font-700">Plans</p>
          <p className="text-[11px] text-muted">Changer de programme</p>
        </Link>
        <Link
          href="/nutrition"
          className="pf-card flex flex-col rounded-[1.3rem] p-4"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <IconDumbbell size={20} />
          </span>
          <p className="mt-3 text-sm font-700">Récup</p>
          <p className="text-[11px] text-muted">Nutrition post-séance</p>
        </Link>
      </AnimateIn>

      <AnimateIn delay={0.14} className="mt-6 overflow-hidden rounded-[1.5rem] pf-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Programme actif
            </p>
            <h2 className="mt-2 font-display text-2xl font-800">
              {day?.name ?? "Aucun plan"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {program
                ? `${program.title} · ~${estMin} min · ${day?.exercises.length ?? 0} exos`
                : "Choisis un programme ou crée ta séance."}
            </p>
          </div>
          {day ? (
            <button
              type="button"
              onClick={start}
              className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_8px_28px_var(--pf-glow)]"
            >
              <PulseRing />
              <IconPlay size={22} className="relative z-10" />
            </button>
          ) : null}
        </div>

        {day ? (
          <div ref={listRef} className="mt-4 space-y-2">
            {day.exercises.map((ex, i) => {
              const meta = getExercise(ex.exerciseId);
              return (
                <div
                  key={ex.exerciseId}
                  data-ex-row
                  className="flex items-center justify-between rounded-xl bg-background/55 px-3 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-[11px] font-700 text-accent">
                      {i + 1}
                    </span>
                    {meta?.nameFr ?? ex.exerciseId}
                  </span>
                  <span className="text-xs text-muted">
                    {ex.sets}×{ex.reps[0]}-{ex.reps[1]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        <Button className="mt-5" onClick={start} disabled={!day} variant="accent">
          <IconPlay size={18} />
          Commencer l&apos;entraînement
        </Button>
        {!program ? (
          <Link href="/plans" className="mt-3 block text-center text-sm text-accent">
            Voir les plans <IconChevron size={14} className="inline" />
          </Link>
        ) : null}
      </AnimateIn>

      {customWorkouts.length > 0 ? (
        <AnimateIn delay={0.18} className="mt-6">
          <h3 className="font-display text-lg font-700">Mes séances</h3>
          <div className="mt-3 space-y-2">
            {customWorkouts.slice(0, 5).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  startSession({ title: w.title, exerciseIds: w.exerciseIds });
                  router.push("/workout/active");
                }}
                className="pf-card flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left"
              >
                <span>
                  <span className="block text-sm font-semibold">{w.title}</span>
                  <span className="text-xs text-muted">
                    {w.exerciseIds.length} exercices
                  </span>
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <IconPlay size={16} />
                </span>
              </button>
            ))}
          </div>
        </AnimateIn>
      ) : null}
    </main>
  );
}

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
