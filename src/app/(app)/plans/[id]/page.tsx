"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { IconBack, IconCheck, IconPlay } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { getProgram } from "@/lib/data/programs";
import { useAppStore } from "@/lib/store/useAppStore";

export default function PlanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const program = getProgram(params.id);
  const setActiveProgram = useAppStore((s) => s.setActiveProgram);
  const startSession = useAppStore((s) => s.startSession);
  const activeProgramId = useAppStore((s) => s.activeProgramId);

  if (!program) {
    return (
      <main className="px-5 pt-10">
        <p>Programme introuvable.</p>
        <Link href="/plans" className="mt-4 inline-block text-accent">
          Retour
        </Link>
      </main>
    );
  }

  function activateAndStart() {
    setActiveProgram(program!.id);
    const day = program!.days[0];
    startSession({
      programId: program!.id,
      dayId: day.id,
      title: day.name,
    });
    router.push("/workout/active");
  }

  return (
    <main className="pb-4">
      <div className="relative overflow-hidden bg-gradient-to-b from-accent/25 via-surface to-background px-5 pb-8 pt-6">
        <Link
          href="/plans"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"
        >
          <IconBack size={20} />
        </Link>
        <AnimateIn className="mt-10">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-contrast">
            {activeProgramId === program.id ? "Actif" : "Personnalisé"}
          </span>
          <h1 className="font-display mt-4 text-3xl font-800 uppercase tracking-wide">
            {program.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {program.weeks} semaines · {program.level} · {program.days.length}{" "}
            séances types
          </p>
        </AnimateIn>
      </div>

      <div className="space-y-6 px-5 pt-2">
        <AnimateIn delay={0.08}>
          <p className="text-sm leading-relaxed text-muted">{program.description}</p>
          <ul className="mt-4 space-y-2">
            {[
              "Progression guidée séance après séance",
              "Alternatives si matériel indisponible",
              "Historique immuable des séances terminées",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <IconCheck size={18} className="mt-0.5 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </AnimateIn>

        <AnimateIn delay={0.14}>
          <h2 className="font-display text-lg font-700">Aperçu du plan</h2>
          <ol className="mt-3 space-y-3">
            {program.days.map((d, i) => (
              <li
                key={d.id}
                className="relative rounded-2xl bg-surface px-4 py-3 pl-12"
              >
                <span className="absolute left-4 top-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-muted">
                  {d.focus} · {d.exercises.length} exercices
                </p>
              </li>
            ))}
          </ol>
        </AnimateIn>

        <div className="space-y-3 pt-2">
          <Button onClick={activateAndStart}>
            <IconPlay size={18} />
            Démarrer le plan
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveProgram(program.id)}
          >
            Définir comme programme actif
          </Button>
        </div>
      </div>
    </main>
  );
}
