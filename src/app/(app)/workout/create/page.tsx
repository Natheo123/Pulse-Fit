"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import {
  ExerciseThumb,
  ExerciseVideo,
} from "@/components/exercises/ExerciseVideo";
import {
  aggregateExerciseFascicles,
  MuscleMap,
} from "@/components/muscles/MuscleMap";
import { fasciclesFromFocus } from "@/lib/fascicles";
import { IconBack, IconCheck, IconPlus } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { EXERCISES, getExercise } from "@/lib/data/exercises";
import { filterByEquipment } from "@/lib/equipment";
import { useAppStore } from "@/lib/store/useAppStore";
import type { Exercise, MuscleGroup } from "@/lib/types";

type FocusId = MuscleGroup | "balanced" | "arms";

const FOCUS: { id: FocusId; label: string }[] = [
  { id: "balanced", label: "Équilibré" },
  { id: "chest", label: "Pecs" },
  { id: "back", label: "Dos" },
  { id: "legs", label: "Jambes" },
  { id: "shoulders", label: "Épaules" },
  { id: "arms", label: "Bras" },
  { id: "core", label: "Core" },
];

const MUSCLE_FR: Record<string, string> = {
  chest: "pecs",
  back: "dos",
  shoulders: "épaules",
  biceps: "biceps",
  triceps: "triceps",
  legs: "jambes",
  glutes: "fessiers",
  core: "abdos",
};

function matchesFocus(e: Exercise, focus: FocusId) {
  if (focus === "balanced") return true;
  if (focus === "arms") {
    return e.muscles.includes("biceps") || e.muscles.includes("triceps");
  }
  // Primary muscle must match — not just secondary
  const primary =
    e.muscleLoad &&
    Object.entries(e.muscleLoad).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0];
  return primary === focus || e.muscles[0] === focus;
}

export default function CreateWorkoutPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const startSession = useAppStore((s) => s.startSession);
  const saveCustomWorkout = useAppStore((s) => s.saveCustomWorkout);
  const customWorkouts = useAppStore((s) => s.customWorkouts);

  const [title, setTitle] = useState("Ma séance");
  const [selected, setSelected] = useState<string[]>([]);
  const [focus, setFocus] = useState<FocusId>("balanced");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const byFocus = EXERCISES.filter((e) => matchesFocus(e, focus));
    return filterByEquipment(byFocus, user?.equipment);
  }, [focus, user?.equipment]);

  const recommended = useMemo(() => filtered.slice(0, 5), [filtered]);

  const fascicleLoads = useMemo(() => {
    if (selected.length) {
      return aggregateExerciseFascicles(
        selected.map((id) => {
          const ex = getExercise(id);
          return { id, muscleLoad: ex?.muscleLoad };
        })
      );
    }
    return fasciclesFromFocus(focus);
  }, [selected, focus]);

  const preview = previewId ? getExercise(previewId) : null;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function applyRecommended() {
    setSelected(recommended.map((e) => e.id));
  }

  function start() {
    if (!selected.length) return;
    saveCustomWorkout(title, selected);
    startSession({ title, exerciseIds: selected });
    router.push("/workout/active");
  }

  return (
    <main className="px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <Link
          href="/workout"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <IconBack size={20} />
        </Link>
        <h1 className="font-display text-2xl font-700">Créer une séance</h1>
      </div>

      <AnimateIn className="mt-5">
        <label className="text-sm text-muted">Nom de la séance</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 outline-none focus:border-accent"
        />
      </AnimateIn>

      <AnimateIn delay={0.05} className="mt-5">
        <p className="text-sm text-muted">Focus recommandé</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {FOCUS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFocus(f.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                focus === f.id
                  ? "bg-accent text-accent-contrast"
                  : "bg-surface text-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <MuscleMap fascicleLoads={fascicleLoads} compact />
        </div>

        <button
          type="button"
          onClick={applyRecommended}
          className="mt-3 w-full rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-left text-sm"
        >
          <span className="font-semibold text-accent">Suggestion PulseFit</span>
          <span className="mt-1 block text-muted">
            {recommended.map((e) => e.nameFr).join(" · ") || "Aucune suggestion"}
          </span>
        </button>
      </AnimateIn>

      <AnimateIn delay={0.1} className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-700">Exercices</h2>
          <span className="text-xs text-muted">
            {selected.length} choisis · {filtered.length} affichés
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {filtered.map((e) => {
            const on = selected.includes(e.id);
            return (
              <div
                key={e.id}
                className={`overflow-hidden rounded-[1.25rem] transition ${
                  on ? "ring-2 ring-accent" : "bg-surface"
                }`}
              >
                <div className={`flex gap-3 p-2.5 ${on ? "bg-accent/15" : "bg-surface"}`}>
                  <button
                    type="button"
                    onClick={() => setPreviewId(e.id)}
                    className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#ebebeb]"
                  >
                    <ExerciseThumb
                      demoUrl={e.demoUrl}
                      demoVideo={e.demoVideo}
                      title={e.nameFr}
                      className="h-full w-full"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {e.nameFr}
                      </span>
                      <span className="mt-0.5 block text-[11px] capitalize text-muted">
                        {e.muscles.map((m) => MUSCLE_FR[m] ?? m).join(" · ")}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted">
                        {e.defaultSets}×{e.defaultReps[0]}-{e.defaultReps[1]} ·{" "}
                        {e.equipment[0]?.replace("_", " ")}
                      </span>
                    </span>
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        on
                          ? "bg-accent text-accent-contrast"
                          : "bg-background text-muted"
                      }`}
                    >
                      {on ? <IconCheck size={16} /> : <IconPlus size={16} />}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <p className="text-sm text-muted">
              Aucun exercice pour ce focus. Change de filtre.
            </p>
          ) : null}
        </div>
      </AnimateIn>

      {customWorkouts.length > 0 ? (
        <AnimateIn delay={0.14} className="mt-6">
          <h2 className="font-display text-lg font-700">Tes séances sauvées</h2>
          <div className="mt-3 space-y-2">
            {customWorkouts.slice(0, 5).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setTitle(w.title);
                  setSelected(w.exerciseIds);
                }}
                className="w-full rounded-2xl bg-surface px-4 py-3 text-left text-sm"
              >
                <span className="font-semibold">{w.title}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {w.exerciseIds.length} exercices
                </span>
              </button>
            ))}
          </div>
        </AnimateIn>
      ) : null}

      <div className="mt-6">
        <Button disabled={!selected.length} variant="accent" onClick={start}>
          Démarrer ma séance ({selected.length})
        </Button>
      </div>

      {preview ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
          <div className="max-h-[90dvh] w-full max-w-[420px] overflow-y-auto rounded-[1.5rem] bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-700">{preview.nameFr}</h3>
                <p className="text-xs capitalize text-muted">
                  {preview.muscles.map((m) => MUSCLE_FR[m] ?? m).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewId(null)}
                className="rounded-full bg-background px-3 py-1.5 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="mt-3">
              <ExerciseVideo
                demoUrl={preview.demoUrl}
                demoVideo={preview.demoVideo}
                videoId={preview.videoId}
                title={preview.nameFr}
              />
            </div>

            <div className="mt-3">
              <MuscleMap
                exerciseId={preview.id}
                loads={preview.muscleLoad}
                compact
              />
            </div>

            <ol className="mt-3 space-y-1.5 text-sm text-muted">
              {preview.instructions.slice(0, 3).map((step, i) => (
                <li key={step}>
                  <span className="font-semibold text-accent">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>

            <div className="mt-4 flex gap-2">
              <Button
                variant="accent"
                onClick={() => {
                  if (!selected.includes(preview.id)) toggle(preview.id);
                  setPreviewId(null);
                }}
              >
                {selected.includes(preview.id) ? "Déjà ajouté" : "Ajouter à la séance"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
