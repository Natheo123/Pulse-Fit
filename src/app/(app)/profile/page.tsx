"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";
import { AmbientGlow, AnimateIn } from "@/components/gsap/AnimateIn";
import {
  IconChevron,
  IconLeaf,
  IconOffline,
  IconSettings,
} from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { evaluateAchievements } from "@/lib/achievements";
import { ACCENT_MAP } from "@/lib/theme";
import { useAppStore, type AccentColor } from "@/lib/store/useAppStore";
import type { AccentColor as Accent, ThemeMode } from "@/lib/types";

const accents = Object.keys(ACCENT_MAP) as Accent[];

type Tab = "overview" | "achievements";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: Tab =
    tabParam === "achievements" ? "achievements" : "overview";

  const user = useAppStore((s) => s.user);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const logout = useAppStore((s) => s.logout);
  const syncQueue = useAppStore((s) => s.syncQueue);
  const markSynced = useAppStore((s) => s.markSynced);
  const sessions = useAppStore((s) => s.sessions);
  const records = useAppStore((s) => s.records);

  const unlocked = useMemo(
    () => evaluateAchievements(sessions, records).filter((a) => a.unlocked)
      .length,
    [sessions, records]
  );

  function setTab(next: Tab) {
    const url =
      next === "achievements" ? "/profile?tab=achievements" : "/profile";
    router.replace(url, { scroll: false });
  }

  function simulateSync() {
    syncQueue.forEach((id) => markSynced(id));
  }

  return (
    <main className="pf-mesh relative px-4 pb-6 pt-7">
      <AmbientGlow />

      <AnimateIn className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          Compte
        </p>
        <h1 className="font-display mt-1 text-3xl font-800 tracking-tight">
          Profil
        </h1>
        <p className="mt-1.5 text-sm text-muted">{user?.email}</p>
      </AnimateIn>

      {/* Tabs style Lyfta */}
      <div className="relative mt-5 flex gap-1 rounded-2xl bg-surface p-1">
        {(
          [
            { id: "overview" as const, label: "Aperçu" },
            {
              id: "achievements" as const,
              label: `Achievements${unlocked ? ` · ${unlocked}` : ""}`,
            },
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

      {tab === "achievements" ? (
        <AnimateIn delay={0.06} className="relative mt-5">
          <AchievementGrid sessions={sessions} records={records} />
        </AnimateIn>
      ) : (
        <>
          <AnimateIn delay={0.08} className="relative mt-5">
            <div className="pf-card-accent pf-shimmer overflow-hidden rounded-[1.5rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-800 tracking-tight">
                    {user?.name}
                  </p>
                  <p className="mt-1 text-sm capitalize text-muted">
                    {user?.level} ·{" "}
                    <span className={user?.isPremium ? "text-accent" : ""}>
                      {user?.isPremium ? "Premium" : "Gratuit"}
                    </span>
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/50 text-muted backdrop-blur">
                  <IconSettings />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <StatChip
                  label="Séances"
                  value={String(
                    sessions.filter((s) => s.status === "completed").length
                  )}
                />
                <StatChip label="PR" value={String(records.length)} />
                <button
                  type="button"
                  onClick={() => setTab("achievements")}
                  className="rounded-[1.1rem] border border-border/50 bg-background/45 px-2 py-3 text-center backdrop-blur transition hover:border-accent/40"
                >
                  <p className="text-lg font-800 text-accent">{unlocked}</p>
                  <p className="text-[9px] font-800 uppercase tracking-wide text-muted">
                    Badges
                  </p>
                </button>
              </div>
              <div className="mt-3 rounded-[1.1rem] border border-border/50 bg-background/45 px-3.5 py-3 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Objectifs
                </p>
                <p className="mt-1 text-sm font-medium">
                  {user?.goals.join(", ") || "—"}
                </p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.12} className="relative mt-5">
            <h2 className="font-display text-lg font-800">Design</h2>
            <p className="mt-1 text-sm text-muted">
              Accent, thème et unités — ajustables à tout moment.
            </p>

            <div className="mt-3 flex gap-2">
              {(["dark", "light"] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme({ mode })}
                  className={`flex-1 rounded-[1.25rem] py-3.5 text-sm font-semibold transition ${
                    theme.mode === mode
                      ? "bg-accent text-accent-contrast shadow-[0_0_20px_var(--pf-glow)]"
                      : "pf-card"
                  }`}
                >
                  {mode === "dark" ? "Sombre" : "Clair"}
                </button>
              ))}
            </div>

            <div className="pf-card mt-3 rounded-[1.35rem] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Couleur d&apos;accent
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {accents.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setTheme({ accent: a as AccentColor })}
                    className={`h-11 w-11 rounded-full border-2 transition ${
                      theme.accent === a
                        ? "border-white shadow-[0_0_16px_var(--pf-glow)] scale-105"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ background: ACCENT_MAP[a] }}
                    aria-label={a}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {(["kg", "lb"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setTheme({ unit })}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    theme.unit === unit
                      ? "bg-accent text-accent-contrast"
                      : "pf-card"
                  }`}
                >
                  {unit.toUpperCase()}
                </button>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn delay={0.18} className="relative mt-5">
            <div className="pf-card rounded-[1.4rem] p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <IconOffline />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Synchronisation</p>
                  <p className="mt-1 text-sm leading-snug text-muted">
                    {syncQueue.length
                      ? `${syncQueue.length} opération(s) en attente (stockage local).`
                      : "Tout est synchronisé (simulation locale)."}
                  </p>
                  <p className="mt-1.5 text-xs text-muted">
                    {sessions.filter((s) => s.syncStatus === "pending").length}{" "}
                    séance(s) non poussées vers le serveur.
                  </p>
                  {syncQueue.length > 0 ? (
                    <button
                      type="button"
                      onClick={simulateSync}
                      className="mt-3 rounded-full bg-accent px-3.5 py-2 text-xs font-bold text-accent-contrast shadow-[0_0_16px_var(--pf-glow)]"
                    >
                      Simuler sync serveur
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.22} className="relative mt-4 space-y-2">
            <LinkRow
              href="/profile?tab=achievements"
              title="Achievements"
              subtitle={`${unlocked} badges débloqués`}
            />
            <LinkRow href="/nutrition" title="Coach nutrition" icon={<IconLeaf />} />
            <LinkRow href="/premium" title="Offre Premium" />
            <LinkRow href="/ai" title="Coach PulseFit" />
            <LinkRow href="/onboarding?edit=1" title="Refaire le questionnaire" />
          </AnimateIn>

          <AnimateIn delay={0.28} className="relative mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Se déconnecter
            </Button>
          </AnimateIn>
        </>
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="px-5 pt-10 text-sm text-muted">Chargement…</main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-border/50 bg-background/45 px-2 py-3 text-center backdrop-blur">
      <p className="text-lg font-800">{value}</p>
      <p className="text-[9px] font-800 uppercase tracking-wide text-muted">
        {label}
      </p>
    </div>
  );
}

function LinkRow({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="pf-card flex items-center gap-3 rounded-[1.25rem] px-4 py-3.5 transition hover:border-accent/30"
    >
      {icon ? (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-accent">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] text-muted">{subtitle}</span>
        ) : null}
      </span>
      <IconChevron size={16} className="text-muted" />
    </Link>
  );
}
