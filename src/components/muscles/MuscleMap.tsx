"use client";

import { useMemo } from "react";
import Model, { type IExerciseData, type Muscle } from "react-body-highlighter";
import type { MuscleGroup } from "@/lib/types";
import {
  aggregateFascicles,
  FASCICLE_LABELS,
  fasciclesFromFocus,
  resolveFascicles,
  type FascicleId,
  type FascicleLoad,
} from "@/lib/fascicles";

/** Mappe nos faisceaux → régions SVG du highlighter (style Lyfta / bodybuilding) */
const FASCICLE_TO_SVG: Partial<Record<FascicleId, Muscle[]>> = {
  chest_clavicular: ["chest"],
  chest_sternal: ["chest"],
  chest_abdominal: ["chest"],
  delt_anterior: ["front-deltoids"],
  delt_lateral: ["front-deltoids", "back-deltoids"],
  delt_posterior: ["back-deltoids"],
  biceps_long: ["biceps"],
  biceps_short: ["biceps"],
  triceps_long: ["triceps"],
  triceps_lateral: ["triceps"],
  triceps_medial: ["triceps"],
  traps_upper: ["trapezius", "neck"],
  traps_mid: ["trapezius", "upper-back"],
  rhomboids: ["upper-back"],
  lats: ["upper-back", "lower-back"],
  erectors: ["lower-back"],
  quads_rectus: ["quadriceps"],
  quads_vastus: ["quadriceps"],
  hamstrings: ["hamstring"],
  glute_max: ["gluteal"],
  abs_recto: ["abs"],
  abs_oblique: ["obliques"],
  calves: ["calves", "left-soleus", "right-soleus"],
};

const GROUP_LABEL: Partial<Record<Muscle, string>> = {
  chest: "Pectoraux",
  "front-deltoids": "Deltoïdes avant",
  "back-deltoids": "Deltoïdes arrière",
  biceps: "Biceps",
  triceps: "Triceps",
  trapezius: "Trapèzes",
  "upper-back": "Haut du dos",
  "lower-back": "Bas du dos",
  abs: "Abdominaux",
  obliques: "Obliques",
  quadriceps: "Quadriceps",
  hamstring: "Ischio-jambiers",
  gluteal: "Fessiers",
  calves: "Mollets",
  neck: "Cou",
  forearm: "Avant-bras",
};

/** Rouge solide type apps fitness (réf. bodybuilding map) */
const HIGHLIGHT = ["#ff8a80", "#ff5252", "#e53935", "#c62828"];
const BODY = "#cfd4da";

function fasciclesToSvgLoads(loads: FascicleLoad) {
  const out: Partial<Record<Muscle, number>> = {};
  for (const [fid, value] of Object.entries(loads) as [FascicleId, number][]) {
    if (value < 0.28) continue;
    const targets = FASCICLE_TO_SVG[fid] ?? [];
    for (const m of targets) {
      out[m] = Math.max(out[m] ?? 0, value);
    }
  }
  return out;
}

function toHighlighterData(
  svgLoads: Partial<Record<Muscle, number>>
): IExerciseData[] {
  return (Object.entries(svgLoads) as [Muscle, number][])
    .filter(([, v]) => v > 0)
    .map(([muscle, value]) => ({
      name: muscle,
      muscles: [muscle],
      frequency: Math.max(1, Math.min(HIGHLIGHT.length, Math.ceil(value * HIGHLIGHT.length))),
    }));
}

export function MuscleMap({
  loads,
  fascicleLoads,
  exerciseId,
  className = "",
  compact = false,
}: {
  loads?: Partial<Record<MuscleGroup, number>>;
  fascicleLoads?: FascicleLoad;
  exerciseId?: string;
  className?: string;
  compact?: boolean;
}) {
  const resolved = useMemo(() => {
    if (fascicleLoads && Object.keys(fascicleLoads).length) return fascicleLoads;
    return resolveFascicles(exerciseId, loads);
  }, [fascicleLoads, exerciseId, loads]);

  const svgLoads = useMemo(() => fasciclesToSvgLoads(resolved), [resolved]);
  const data = useMemo(() => toHighlighterData(svgLoads), [svgLoads]);

  const list = useMemo(
    () =>
      (Object.entries(resolved) as [FascicleId, number][])
        .filter(([, v]) => v > 0.25)
        .sort((a, b) => b[1] - a[1]),
    [resolved]
  );

  const height = compact ? 210 : 260;

  return (
    <div
      className={`overflow-hidden rounded-[1.25rem] bg-[#1c1c1f] ${className}`}
    >
      <div className="flex items-center justify-between px-3 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Muscles travaillés
        </p>
        <p className="text-[9px] text-zinc-500">Avant · Arrière</p>
      </div>

      <div
        className={`mx-auto flex items-end justify-center gap-1 px-2 pb-1 ${
          compact ? "max-w-[340px]" : "max-w-[400px]"
        }`}
      >
        <Model
          type="anterior"
          data={data}
          bodyColor={BODY}
          highlightedColors={HIGHLIGHT}
          style={{ width: "48%", height }}
          svgStyle={{ width: "100%", height: "100%" }}
        />
        <Model
          type="posterior"
          data={data}
          bodyColor={BODY}
          highlightedColors={HIGHLIGHT}
          style={{ width: "48%", height }}
          svgStyle={{ width: "100%", height: "100%" }}
        />
      </div>

      {list.length > 0 ? (
        <ul className="space-y-1 px-3 pb-3 pt-1">
          {list.slice(0, compact ? 5 : 8).map(([id, value]) => (
            <li
              key={id}
              className="flex items-center justify-between rounded-lg bg-black/35 px-2.5 py-1.5 text-[11px]"
            >
              <span className="flex items-center gap-1.5 font-medium text-zinc-100">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                {FASCICLE_LABELS[id]}
              </span>
              <span className="tabular-nums text-zinc-400">
                {Math.round(value * 100)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-3 pb-3 text-center text-[11px] text-zinc-500">
          Choisis un focus ou un exercice pour voir les zones
        </p>
      )}
    </div>
  );
}

export function aggregateMuscleLoads(
  exerciseLoads: Array<Partial<Record<MuscleGroup, number>> | undefined>
) {
  const out: Partial<Record<MuscleGroup, number>> = {};
  for (const load of exerciseLoads) {
    if (!load) continue;
    for (const [k, v] of Object.entries(load) as [MuscleGroup, number][]) {
      out[k] = Math.min(1, Math.max(out[k] ?? 0, v));
    }
  }
  return out;
}

export function aggregateExerciseFascicles(
  items: Array<{
    id: string;
    muscleLoad?: Partial<Record<MuscleGroup, number>>;
  }>
) {
  return aggregateFascicles(
    items.map((i) => resolveFascicles(i.id, i.muscleLoad))
  );
}

export function focusLoads(
  focus: MuscleGroup | "balanced" | "arms"
): Partial<Record<MuscleGroup, number>> {
  if (focus === "balanced") return {};
  if (focus === "arms") return { biceps: 1, triceps: 0.95 };
  if (focus === "chest") return { chest: 1, shoulders: 0.45, triceps: 0.35 };
  if (focus === "back") return { back: 1, biceps: 0.4, shoulders: 0.3 };
  if (focus === "legs") return { legs: 1, glutes: 0.75, core: 0.25 };
  if (focus === "shoulders") return { shoulders: 1, triceps: 0.35 };
  if (focus === "core") return { core: 1 };
  if (focus === "biceps") return { biceps: 1 };
  if (focus === "triceps") return { triceps: 1 };
  if (focus === "glutes") return { glutes: 1, legs: 0.5 };
  return { [focus]: 1 };
}

export { fasciclesFromFocus, resolveFascicles, GROUP_LABEL };
