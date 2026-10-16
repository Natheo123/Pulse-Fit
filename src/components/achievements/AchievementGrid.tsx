"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_FR,
  evaluateAchievements,
  formatAchievementProgress,
  type AchievementCategory,
  type AchievementStatus,
} from "@/lib/achievements";
import type { PersonalRecord, WorkoutSession } from "@/lib/types";
import { AchievementGlyph, TONE_CLASS } from "./AchievementIcons";

const CATS: { id: AchievementCategory | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "milestones", label: CATEGORY_FR.milestones },
  { id: "consistency", label: CATEGORY_FR.consistency },
  { id: "strength", label: CATEGORY_FR.strength },
  { id: "volume", label: CATEGORY_FR.volume },
  { id: "explorer", label: CATEGORY_FR.explorer },
];

export function AchievementGrid({
  sessions,
  records,
}: {
  sessions: WorkoutSession[];
  records: PersonalRecord[];
}) {
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("all");
  const [selected, setSelected] = useState<AchievementStatus | null>(null);

  const all = useMemo(
    () => evaluateAchievements(sessions, records),
    [sessions, records]
  );

  const unlockedCount = all.filter((a) => a.unlocked).length;
  const list = useMemo(
    () => (cat === "all" ? all : all.filter((a) => a.category === cat)),
    [all, cat]
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="pf-eyebrow">Récompenses</p>
          <h2 className="pf-title mt-1 text-2xl">Achievements</h2>
          <p className="mt-1 text-sm text-muted">
            {unlockedCount} / {all.length} débloqués
          </p>
        </div>
        <div className="rounded-2xl bg-accent/15 px-3 py-2 text-center">
          <p className="text-lg font-800 text-accent">{unlockedCount}</p>
          <p className="text-[9px] font-800 uppercase tracking-wide text-muted">
            Badges
          </p>
        </div>
      </div>

      {/* Progress bar global */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(unlockedCount / all.length) * 100}%` }}
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-800 transition ${
              cat === c.id
                ? "bg-accent text-accent-contrast"
                : "bg-surface text-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {list.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="group flex flex-col items-center gap-2 rounded-[1.25rem] bg-surface/60 p-3 transition hover:bg-surface"
          >
            <BadgeRing achievement={a} />
            <span
              className={`line-clamp-2 text-center text-[11px] font-800 leading-snug ${
                a.unlocked ? "text-foreground" : "text-muted"
              }`}
            >
              {a.title}
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <AchievementSheet
          achievement={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

function BadgeRing({ achievement: a }: { achievement: AchievementStatus }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - a.percent / 100);

  return (
    <div className="relative h-[72px] w-[72px]">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-border/60"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={a.unlocked ? "text-accent" : "text-muted/50"}
        />
      </svg>
      <div
        className={`absolute inset-[8px] flex items-center justify-center rounded-full bg-gradient-to-br shadow-inner ${
          a.unlocked
            ? TONE_CLASS[a.tone]
            : "from-[#2a2a2e] to-[#1a1a1d] text-muted opacity-70"
        }`}
      >
        <AchievementGlyph icon={a.icon} size={22} />
      </div>
      {!a.unlocked ? (
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-background px-1.5 py-0.5 text-[9px] font-800 text-muted">
          {a.percent}%
        </span>
      ) : (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-contrast">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
      )}
    </div>
  );
}

function AchievementSheet({
  achievement: a,
  onClose,
}: {
  achievement: AchievementStatus;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-[1.5rem] border border-border bg-background p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={a.title}
      >
        <div className="flex flex-col items-center text-center">
          <BadgeRing achievement={a} />
          <h3 className="pf-title mt-4 text-xl">{a.title}</h3>
          <p className="mt-1 text-xs font-800 uppercase tracking-wide text-accent">
            {CATEGORY_FR[a.category]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {a.description}
          </p>
          <div className="mt-4 w-full rounded-2xl bg-surface px-4 py-3">
            <div className="flex items-center justify-between text-xs font-800">
              <span className="text-muted">Progression</span>
              <span>{formatAchievementProgress(a)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${a.percent}%` }}
              />
            </div>
            {a.unlocked && a.unlockedAt ? (
              <p className="mt-2 text-[11px] text-muted">
                Débloqué le{" "}
                {new Date(a.unlockedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-accent py-3 text-sm font-800 text-accent-contrast"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
