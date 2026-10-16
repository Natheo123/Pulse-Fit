"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import {
  AmbientGlow,
  AnimateIn,
  CountUp,
  Pressable,
  PulseRing,
  useStaggerIn,
} from "@/components/gsap/AnimateIn";
import {
  IconCalendar,
  IconChat,
  IconChevron,
  IconDumbbell,
  IconFlame,
  IconLeaf,
  IconMuscle,
  IconPlay,
  IconChart,
  IconPlus,
} from "@/components/icons/Icons";
import { SoftBadge } from "@/components/ui/PremiumBits";
import { getExercise } from "@/lib/data/exercises";
import { getProgram, PROGRAMS } from "@/lib/data/programs";
import { useAppStore } from "@/lib/store/useAppStore";

const MOTIVATIONS = [
  "Aujourd’hui compte plus que hier.",
  "Une série de plus, un cran de plus.",
  "La constance bat le talent.",
  "Ton futur toi te remercie déjà.",
];

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const activeProgramId = useAppStore((s) => s.activeProgramId);
  const sessions = useAppStore((s) => s.sessions);
  const recommendations = useAppStore((s) => s.recommendations);
  const records = useAppStore((s) => s.records);
  const customWorkouts = useAppStore((s) => s.customWorkouts);
  const program = activeProgramId ? getProgram(activeProgramId) : undefined;
  const completed = sessions.filter((s) => s.status === "completed");
  const nextRec = recommendations.find((r) => !r.userDecision);
  const day = program?.days[0];
  const gridRef = useStaggerIn("[data-quick]");

  const hour = new Date().getHours();
  const hello = hour < 12 ? "Bonjour" : hour < 18 ? "Salut" : "Bonsoir";
  const motivation = MOTIVATIONS[new Date().getDay() % MOTIVATIONS.length];

  const volume = useMemo(
    () =>
      completed.reduce(
        (sum, sess) =>
          sum +
          sess.exercises.reduce(
            (a, ex) =>
              a +
              ex.sets
                .filter((st) => st.completed)
                .reduce((b, st) => b + st.weight * st.reps, 0),
            0
          ),
        0
      ),
    [completed]
  );

  const streak = useMemo(() => {
    if (!completed.length) return 0;
    const days = new Set(
      completed.map((s) =>
        new Date(s.completedAt ?? s.startedAt).toDateString()
      )
    );
    let n = 0;
    const d = new Date();
    for (let i = 0; i < 21; i++) {
      if (days.has(d.toDateString())) n += 1;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }, [completed]);

  const chartPoints = useMemo(() => {
    const last = completed.slice(0, 7).reverse();
    if (!last.length) return [12, 14, 13, 16, 18, 17, 20];
    return last.map((s) => {
      const weights = s.exercises.flatMap((e) =>
        e.sets.filter((x) => x.completed).map((x) => x.weight)
      );
      return weights.length ? Math.max(...weights) : 15;
    });
  }, [completed]);

  const maxY = Math.max(...chartPoints, 20);
  const minY = Math.min(...chartPoints, 10);
  const w = 280;
  const h = 72;
  const path = chartPoints
    .map((y, i) => {
      const x = (i / Math.max(chartPoints.length - 1, 1)) * (w - 12) + 6;
      const yy = h - ((y - minY) / Math.max(maxY - minY, 1)) * (h - 14) - 6;
      return `${i === 0 ? "M" : "L"}${x},${yy}`;
    })
    .join(" ");

  const trainedDays = useMemo(() => {
    const set = new Set(
      completed.map((s) =>
        new Date(s.completedAt ?? s.startedAt).toDateString()
      )
    );
    return WEEK_DAYS.map((_, i) => {
      const d = new Date();
      const dayIdx = (d.getDay() + 6) % 7;
      const offset = i - dayIdx;
      const dd = new Date();
      dd.setDate(d.getDate() + offset);
      return set.has(dd.toDateString());
    });
  }, [completed]);

  const estMinutes = day
    ? day.exercises.reduce(
        (s, e) => s + e.sets * 45 + (e.restSeconds ?? 60) * e.sets,
        0
      ) / 60
    : user?.sessionMinutes ?? 45;

  const featuredPlan = program ?? PROGRAMS[0];
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <main className="pf-mesh relative px-4 pb-8 pt-6">
      <AmbientGlow />

      <AnimateIn className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="pf-eyebrow">{todayLabel}</p>
          <h1 className="pf-title mt-1.5 text-[1.85rem]">
            {hello},{" "}
            <span className="text-accent">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-1.5 max-w-[17rem] text-xs leading-relaxed text-muted">
            {motivation}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {streak > 0 ? (
            <div className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/12 px-2.5 py-1.5 text-accent">
              <IconFlame size={15} />
              <span className="text-xs font-800">{streak}</span>
            </div>
          ) : null}
          <Link
            href="/ai"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-[0_0_24px_var(--pf-glow)]"
          >
            <IconChat size={19} />
          </Link>
        </div>
      </AnimateIn>

      {/* Hero séance */}
      <AnimateIn delay={0.05} className="relative mt-5">
        <div className="pf-card-accent pf-shimmer relative overflow-hidden rounded-[1.65rem] p-4.5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="pf-eyebrow">Prochaine séance</p>
              <h2 className="pf-title mt-2.5 text-[1.65rem] leading-tight">
                {day?.name ?? "Ta première séance"}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {program
                  ? `${program.title} · ~${Math.round(estMinutes)} min · ${day?.exercises.length ?? 0} exercices`
                  : "Choisis un plan ou crée ta propre séance en 30 secondes."}
              </p>
            </div>
            <Link
              href={program ? "/workout" : "/plans"}
              className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_10px_32px_var(--pf-glow)]"
              aria-label="Lancer la séance"
            >
              <PulseRing />
              <IconPlay size={22} className="relative z-10" />
            </Link>
          </div>

          {day ? (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {day.exercises.slice(0, 5).map((ex, i) => {
                const meta = getExercise(ex.exerciseId);
                return (
                  <span
                    key={ex.exerciseId}
                    className="shrink-0 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-semibold backdrop-blur"
                  >
                    <span className="mr-1 text-accent">{i + 1}</span>
                    {meta?.nameFr.split(" ").slice(0, 2).join(" ")}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Link
                href="/plans"
                className="rounded-full bg-accent px-3.5 py-2 text-xs font-800 text-accent-contrast"
              >
                Voir les plans
              </Link>
              <Link
                href="/workout/create"
                className="rounded-full border border-border bg-background/50 px-3.5 py-2 text-xs font-700"
              >
                Créer ma séance
              </Link>
            </div>
          )}
        </div>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.1} className="relative mt-3 overflow-hidden rounded-[1.45rem] pf-card p-4">
        <div className="grid grid-cols-3 gap-2">
          <MiniStat
            label="Séances"
            value={
              <CountUp value={completed.length} className="pf-title text-xl" />
            }
          />
          <MiniStat
            label="Volume"
            value={
              <CountUp
                value={Math.round(volume / 1000) || 0}
                suffix="k"
                className="pf-title text-xl"
              />
            }
          />
          <MiniStat
            label="PR"
            value={
              records[0] ? (
                <CountUp
                  value={records[0].weight}
                  suffix="kg"
                  className="pf-title text-xl"
                />
              ) : (
                <span className="pf-title text-xl">—</span>
              )
            }
          />
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" aria-hidden>
          <defs>
            <linearGradient id="homeChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pf-accent)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--pf-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L${w - 6},${h} L6,${h} Z`} fill="url(#homeChartFill)" />
          <path
            d={path}
            fill="none"
            stroke="var(--pf-accent)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-[10px] text-muted">Charges · 7 dernières séances</p>
          <Link href="/stats" className="text-[10px] font-800 text-accent">
            Stats →
          </Link>
        </div>
      </AnimateIn>

      {/* Semaine */}
      <AnimateIn delay={0.14} className="relative mt-3 rounded-[1.35rem] pf-card px-3 py-3.5">
        <div className="mb-2.5 flex items-center justify-between px-1">
          <p className="text-[11px] font-800 uppercase tracking-wider text-muted">
            Cette semaine
          </p>
          <p className="text-[11px] text-muted">
            Objectif {user?.daysPerWeek ?? 3}j
          </p>
        </div>
        <div className="flex justify-between gap-1">
          {WEEK_DAYS.map((d, i) => {
            const isToday = ((new Date().getDay() + 6) % 7) === i;
            const done = trainedDays[i];
            return (
              <div key={`${d}-${i}`} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted">{d}</span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-800 transition ${
                    done
                      ? "bg-accent text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                      : isToday
                        ? "border border-accent/55 text-accent"
                        : "bg-background text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </AnimateIn>

      {/* Explorer */}
      <AnimateIn delay={0.18} className="relative mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h3 className="pf-title text-lg">Explorer</h3>
          <p className="text-[10px] text-muted">Tout ton écosystème</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-2 gap-2.5">
          <QuickLink
            href="/workout"
            icon={<IconPlay size={20} />}
            title="S’entraîner"
            sub="Lancer maintenant"
            accent
          />
          <QuickLink
            href="/plans"
            icon={<IconCalendar size={20} />}
            title="Programmes"
            sub={`${PROGRAMS.length} plans`}
          />
          <QuickLink
            href="/exercises"
            icon={<IconMuscle size={20} />}
            title="Exercices"
            sub="Vidéos + muscles"
          />
          <QuickLink
            href="/nutrition"
            icon={<IconLeaf size={20} />}
            title="Nutrition"
            sub="Plats & macros"
          />
          <QuickLink
            href="/workout/create"
            icon={<IconPlus size={20} />}
            title="Custom"
            sub={
              customWorkouts.length
                ? `${customWorkouts.length} sauv.`
                : "Composer"
            }
          />
          <QuickLink
            href="/stats"
            icon={<IconChart size={20} />}
            title="Progression"
            sub="PR & courbes"
          />
          <QuickLink
            href="/ai"
            icon={<IconChat size={20} />}
            title="Coach IA"
            sub="Coach local"
          />
          <QuickLink
            href="/profile"
            icon={<IconDumbbell size={20} />}
            title="Profil"
            sub="Objectifs"
          />
        </div>
      </AnimateIn>

      <AnimateIn delay={0.22} className="relative mt-4">
        <Link
          href={`/plans/${featuredPlan.id}`}
          className="pf-card block overflow-hidden rounded-[1.45rem] p-4"
        >
          <div className="flex items-center gap-2">
            <SoftBadge tone={program ? "success" : "accent"}>
              {program ? "Actif" : "Reco"}
            </SoftBadge>
            <span className="text-[10px] text-muted">
              {featuredPlan.weeks} sem. · {featuredPlan.level}
            </span>
          </div>
          <h3 className="pf-title mt-3 text-xl uppercase tracking-wide">
            {featuredPlan.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs text-muted">
            {featuredPlan.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-800 text-accent">
            Ouvrir le plan <IconChevron size={14} />
          </span>
        </Link>
      </AnimateIn>

      <AnimateIn delay={0.26} className="relative mt-3 rounded-[1.3rem] pf-card p-4">
        <p className="pf-eyebrow">
          {nextRec ? "Tip progression" : "Challenge du jour"}
        </p>
        <p className="mt-2 text-sm leading-snug">
          {nextRec?.explanation ??
            "Termine ta séance sans sauter le dernier set — c’est là que la progression se joue."}
        </p>
        {nextRec ? (
          <Link
            href="/stats"
            className="mt-2 inline-flex items-center gap-1 text-xs font-800 text-accent"
          >
            Voir tout <IconChevron size={14} />
          </Link>
        ) : null}
      </AnimateIn>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-background/75 px-2 py-2.5 text-center">
      <div className="leading-none">{value}</div>
      <p className="mt-1.5 text-[9px] font-700 uppercase tracking-wide text-muted">
        {label}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  sub,
  accent,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <Pressable className="h-full">
      <Link
        data-quick
        href={href}
        className={`flex h-full flex-col rounded-[1.25rem] p-3.5 transition ${
          accent
            ? "bg-accent text-accent-contrast shadow-[0_10px_28px_var(--pf-glow)]"
            : "pf-card hover:border-accent/35"
        }`}
      >
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
            accent ? "bg-black/15" : "bg-accent/14 text-accent"
          }`}
        >
          {icon}
        </span>
        <p className="mt-3 text-sm font-800 leading-tight">{title}</p>
        <p className={`mt-0.5 text-[10px] ${accent ? "opacity-75" : "text-muted"}`}>
          {sub}
        </p>
      </Link>
    </Pressable>
  );
}
