"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimateIn, useStaggerIn } from "@/components/gsap/AnimateIn";
import {
  IconBack,
  IconChevron,
  IconFlame,
  IconMuscle,
  IconScale,
} from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { recommendPrograms } from "@/lib/data/programs";
import { useAppStore } from "@/lib/store/useAppStore";
import type { Equipment, FitnessLevel, Goal } from "@/lib/types";

const TOTAL = 4;

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-muted">
          Chargement…
        </div>
      }
    >
      <OnboardingInner />
    </Suspense>
  );
}

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const user = useAppStore((s) => s.user);
  const updateOnboarding = useAppStore((s) => s.updateOnboarding);
  const setActiveProgram = useAppStore((s) => s.setActiveProgram);

  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [level, setLevel] = useState<FitnessLevel | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [sessionMinutes, setSessionMinutes] = useState(60);

  const listRef = useStaggerIn("[data-option]", [step]);

  useEffect(() => {
    if (!user) router.replace("/register");
    else if (user.onboardingComplete && !editMode) router.replace("/home");
  }, [user, router, editMode]);

  useEffect(() => {
    if (!user || !editMode) return;
    setGoals(user.goals);
    setLevel(user.level);
    setEquipment(user.equipment);
    setDaysPerWeek(user.daysPerWeek);
    setSessionMinutes(user.sessionMinutes);
  }, [user, editMode]);

  const canNext = useMemo(() => {
    if (step === 0) return goals.length > 0;
    if (step === 1) return !!level;
    if (step === 2) return equipment.length > 0;
    return true;
  }, [step, goals, level, equipment]);

  function toggleGoal(g: Goal) {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function toggleEquipment(e: Equipment) {
    setEquipment((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  function finish() {
    if (!level) return;
    updateOnboarding({
      level,
      goals,
      equipment,
      daysPerWeek,
      sessionMinutes,
    });
    const recommended = recommendPrograms({ level, goals, equipment });
    if (recommended[0]) setActiveProgram(recommended[0].id);
    router.push("/home");
  }

  function next() {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else finish();
  }

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-8 pt-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <IconBack size={20} />
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition ${
                i <= step ? "bg-white" : "bg-surface-2"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimateIn key={step} className="mt-8">
        <h1 className="font-display text-[1.85rem] font-700 leading-tight">
          {step === 0 && "Quels sont tes objectifs ?"}
          {step === 1 && "Quel est ton niveau ?"}
          {step === 2 && "Quel matériel as-tu ?"}
          {step === 3 && "Tes disponibilités"}
        </h1>
      </AnimateIn>

      <div ref={listRef} className="mt-6 flex-1 space-y-3">
        {step === 0 && (
          <>
            <OptionCard
              selected={goals.includes("lose_weight")}
              title="Perdre du poids"
              icon={<IconScale className="text-orange-400" />}
              onClick={() => toggleGoal("lose_weight")}
            />
            <OptionCard
              selected={goals.includes("build_muscle")}
              title="Prendre du muscle"
              icon={<IconMuscle className="text-orange-300" />}
              onClick={() => toggleGoal("build_muscle")}
            />
            <OptionCard
              selected={goals.includes("keep_fit")}
              title="Rester en forme"
              icon={<IconFlame className="text-violet-400" />}
              onClick={() => toggleGoal("keep_fit")}
            />
            <OptionCard
              selected={goals.includes("strength")}
              title="Gagner en force"
              icon={<IconMuscle className="text-accent" />}
              onClick={() => toggleGoal("strength")}
            />
          </>
        )}

        {step === 1 && (
          <>
            <OptionCard
              selected={level === "beginner"}
              title="Débutant"
              subtitle="Nouveau en musculation."
              onClick={() => setLevel("beginner")}
            />
            <OptionCard
              selected={level === "intermediate"}
              title="Intermédiaire"
              subtitle="Tu t'entraînes déjà quelques fois par semaine."
              onClick={() => setLevel("intermediate")}
            />
            <OptionCard
              selected={level === "advanced"}
              title="Avancé"
              subtitle="Régulier et tu pousses tes limites."
              onClick={() => setLevel("advanced")}
            />
          </>
        )}

        {step === 2 && (
          <>
            {(
              [
                ["full_gym", "Salle complète"],
                ["machines", "Machines"],
                ["dumbbells", "Haltères"],
                ["home", "Maison"],
                ["bodyweight", "Poids du corps"],
              ] as const
            ).map(([id, label]) => (
              <OptionCard
                key={id}
                selected={equipment.includes(id)}
                title={label}
                onClick={() => toggleEquipment(id)}
              />
            ))}
          </>
        )}

        {step === 3 && (
          <div className="space-y-6 pt-2">
            <div>
              <p className="mb-3 text-sm text-muted">Jours / semaine</p>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    type="button"
                    data-option
                    onClick={() => setDaysPerWeek(d)}
                    className={`h-12 w-12 rounded-2xl text-sm font-semibold transition ${
                      daysPerWeek === d
                        ? "bg-accent text-accent-contrast"
                        : "bg-surface text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-muted">Durée de séance</p>
              <div className="flex flex-wrap gap-2">
                {[30, 45, 60, 75, 90].map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-option
                    onClick={() => setSessionMinutes(m)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      sessionMinutes === m
                        ? "bg-accent text-accent-contrast"
                        : "bg-surface text-foreground"
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-surface p-4">
                <label className="text-sm text-muted">
                  Durée personnalisée (si plus de 90 min)
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={15}
                    max={300}
                    step={5}
                    value={sessionMinutes}
                    data-option
                    onChange={(e) =>
                      setSessionMinutes(
                        Math.min(300, Math.max(15, Number(e.target.value) || 15))
                      )
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-accent"
                  />
                  <span className="shrink-0 text-sm text-muted">min</span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Ex. 120 = 2h, 150 = 2h30. Max 300 min.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6">
        <Button disabled={!canNext} onClick={next}>
          {step === TOTAL - 1 ? "Générer mon programme" : "Suivant"}
        </Button>
      </div>
    </main>
  );
}

function OptionCard({
  title,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-option
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[1.35rem] px-4 py-4 text-left transition ${
        selected
          ? "bg-accent text-accent-contrast"
          : "bg-surface text-foreground"
      }`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        {subtitle ? (
          <span
            className={`mt-0.5 block text-sm ${
              selected ? "text-black/70" : "text-muted"
            }`}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
          selected ? "bg-black/15" : "bg-surface-2"
        }`}
      >
        <IconChevron size={16} />
      </span>
    </button>
  );
}
