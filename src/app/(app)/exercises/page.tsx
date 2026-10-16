"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AmbientGlow,
  AnimateIn,
  useStaggerIn,
} from "@/components/gsap/AnimateIn";
import { ExerciseThumb } from "@/components/exercises/ExerciseVideo";
import { IconMuscle } from "@/components/icons/Icons";
import { EXERCISES } from "@/lib/data/exercises";
import { EQUIPMENT_FR, filterByEquipment } from "@/lib/equipment";
import { useAppStore } from "@/lib/store/useAppStore";
import type { MuscleGroup } from "@/lib/types";

const muscles: { id: MuscleGroup | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "chest", label: "Pecs" },
  { id: "back", label: "Dos" },
  { id: "legs", label: "Jambes" },
  { id: "shoulders", label: "Épaules" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "core", label: "Core" },
  { id: "glutes", label: "Fessiers" },
];

const MUSCLE_FR: Record<string, string> = {
  chest: "Pectoraux",
  back: "Dos",
  legs: "Jambes",
  shoulders: "Épaules",
  biceps: "Biceps",
  triceps: "Triceps",
  core: "Core",
  glutes: "Fessiers",
  full_body: "Full body",
};

export default function ExercisesPage() {
  const user = useAppStore((s) => s.user);
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<(typeof muscles)[number]["id"]>("all");
  const [showAll, setShowAll] = useState(false);
  const listRef = useStaggerIn("[data-ex]", [muscle, q, showAll, user?.equipment]);

  const hasFullGym = Boolean(user?.equipment?.includes("full_gym"));
  const equipLabel = hasFullGym
    ? "Salle complète · tout le catalogue"
    : user?.equipment?.length
      ? `Selon ton matos · ${user.equipment.map((e) => EQUIPMENT_FR[e]).join(" · ")} + poids du corps`
      : "Tout le catalogue";

  const available = useMemo(() => {
    if (showAll || hasFullGym) return EXERCISES;
    return filterByEquipment(EXERCISES, user?.equipment);
  }, [user?.equipment, showAll, hasFullGym]);

  const list = useMemo(() => {
    return available.filter((e) => {
      const matchQ =
        !q ||
        e.nameFr.toLowerCase().includes(q.toLowerCase()) ||
        e.name.toLowerCase().includes(q.toLowerCase());
      const matchM = muscle === "all" || e.muscles.includes(muscle);
      return matchQ && matchM;
    });
  }, [q, muscle, available]);

  return (
    <main className="pf-mesh relative px-4 pb-6 pt-8">
      <AmbientGlow />

      <AnimateIn>
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="pf-eyebrow">Bibliothèque</p>
            <h1 className="pf-title mt-1.5 text-3xl">Exercices</h1>
            <p className="mt-1 text-sm text-muted">
              {list.length} vidéos démo · {equipLabel}
            </p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <IconMuscle size={22} />
          </span>
        </div>
      </AnimateIn>

      {!hasFullGym && user?.equipment?.length ? (
        <AnimateIn delay={0.04} className="mt-4 px-1">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className={`w-full rounded-2xl px-4 py-3 text-left text-xs font-800 transition ${
              showAll
                ? "bg-accent text-accent-contrast"
                : "bg-surface text-muted"
            }`}
          >
            {showAll
              ? `Afficher seulement mon équipement (${filterByEquipment(EXERCISES, user.equipment).length})`
              : `Voir tout le catalogue (${EXERCISES.length}) — salle complète`}
          </button>
        </AnimateIn>
      ) : null}

      <AnimateIn delay={0.06} className="mt-4 px-1">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un exercice…"
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--pf-glow)]"
          />
        </div>
      </AnimateIn>

      <div className="mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {muscles.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMuscle(m.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-800 transition ${
              muscle === m.id
                ? "bg-accent text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                : "bg-surface text-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="mt-4 px-1 text-[11px] text-muted">
        {list.length} exercice{list.length > 1 ? "s" : ""}
        {!showAll && !hasFullGym ? " adaptés à ton matériel" : ""}
      </p>

      <div ref={listRef} className="mt-2 grid grid-cols-2 gap-2.5">
        {list.map((e) => (
          <Link
            key={e.id}
            data-ex
            href={`/exercises/${e.id}`}
            className="pf-card group overflow-hidden rounded-[1.25rem] transition hover:border-accent/40"
          >
            <ExerciseThumb
              demoUrl={e.demoUrl}
              demoVideo={e.demoVideo}
              title={e.nameFr}
              className="aspect-[4/3] w-full"
            />
            <div className="px-2.5 py-2.5">
              <h2 className="line-clamp-2 text-[13px] font-800 leading-snug">
                {e.nameFr}
              </h2>
              <p className="mt-1 line-clamp-1 text-[10px] text-muted">
                {e.muscles.map((m) => MUSCLE_FR[m] ?? m).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
