"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AmbientGlow, AnimateIn, useStaggerIn } from "@/components/gsap/AnimateIn";
import { IconChat, IconChevron } from "@/components/icons/Icons";
import { PROGRAMS, recommendPrograms } from "@/lib/data/programs";
import { useAppStore } from "@/lib/store/useAppStore";

const filters = ["Tous", "Force", "Débutant", "Maison", "Cardio"] as const;

export default function PlansPage() {
  const user = useAppStore((s) => s.user);
  const activeProgramId = useAppStore((s) => s.activeProgramId);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const listRef = useStaggerIn("[data-plan]", [filter]);

  const recommended = useMemo(
    () =>
      recommendPrograms({
        level: user?.level ?? null,
        goals: user?.goals ?? [],
        equipment: user?.equipment ?? [],
      }),
    [user]
  );

  const featured = recommended[0] ?? PROGRAMS[0];

  const list = useMemo(() => {
    return PROGRAMS.filter((p) => {
      if (filter === "Tous") return true;
      if (filter === "Force")
        return p.goals.includes("strength") || p.goals.includes("build_muscle");
      if (filter === "Débutant") return p.level === "beginner";
      if (filter === "Maison") return p.equipment.includes("home");
      if (filter === "Cardio")
        return p.goals.includes("lose_weight") || p.goals.includes("keep_fit");
      return true;
    });
  }, [filter]);

  return (
    <main className="pf-mesh relative px-4 pb-6 pt-7">
      <AmbientGlow />

      <AnimateIn className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Programmes
          </p>
          <h1 className="font-display mt-1 text-3xl font-800 tracking-tight">
            Mes plans
          </h1>
          <p className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-muted">
            Choisis un programme adapté à ton niveau et ton matériel.
          </p>
        </div>
        <Link
          href="/ai"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-accent shadow-[0_0_20px_var(--pf-glow)]"
        >
          <IconChat size={20} />
        </Link>
      </AnimateIn>

      <div className="relative mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f
                ? "bg-accent text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                : "border border-border/60 bg-surface/80 text-muted backdrop-blur"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <AnimateIn delay={0.1} className="relative mt-5">
        <Link
          href={`/plans/${featured.id}`}
          className="pf-card-accent pf-shimmer block overflow-hidden rounded-[1.6rem] p-5"
        >
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-contrast">
              Personnalisé
            </span>
            <span className="rounded-full border border-white/10 bg-background/40 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
              Recommandé pour toi
            </span>
          </div>
          <h2 className="font-display mt-4 text-2xl font-800 uppercase tracking-wide">
            {featured.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {featured.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-background/50 px-2.5 py-1 font-medium backdrop-blur">
              {featured.weeks} semaines
            </span>
            <span className="rounded-full bg-background/50 px-2.5 py-1 font-medium capitalize backdrop-blur">
              {featured.level}
            </span>
            <span className="rounded-full bg-background/50 px-2.5 py-1 font-medium backdrop-blur">
              {featured.days.length} séances
            </span>
          </div>
        </Link>
      </AnimateIn>

      <div ref={listRef} className="relative mt-6 space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-800">Tous les programmes</h3>
          <p className="text-[11px] tabular-nums text-muted">{list.length}</p>
        </div>
        {list.map((p) => (
          <Link
            key={p.id}
            data-plan
            href={`/plans/${p.id}`}
            className="pf-card flex items-center gap-3 rounded-[1.25rem] px-4 py-4 transition hover:border-accent/30"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                {p.title}
                {activeProgramId === p.id ? (
                  <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    Actif
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-muted">
                {p.weeks} sem. · {p.level} · {p.tags.join(" · ")}
              </p>
            </div>
            <IconChevron size={18} className="shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </main>
  );
}
