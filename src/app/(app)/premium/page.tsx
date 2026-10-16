"use client";

import { AnimateIn } from "@/components/gsap/AnimateIn";
import { IconCheck } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";

const free = [
  "Programmes de base",
  "Catalogue d'exercices",
  "Suivi des séances hors ligne",
  "Recommandations de progression",
  "Stats essentielles",
];

const premium = [
  "Stats avancées & thèmes étendus",
  "Programmes personnalisés étendus",
  "Assistant IA (quota)",
  "Nutrition : menus & listes",
  "Sync multi-appareils prioritaire",
];

export default function PremiumPage() {
  const user = useAppStore((s) => s.user);

  function togglePremium() {
    if (!user) return;
    const next = { ...user, isPremium: !user.isPremium };
    useAppStore.setState((s) => ({
      user: next,
      accounts: { ...s.accounts, [next.email]: next },
    }));
  }

  return (
    <main className="px-5 pb-4 pt-8">
      <AnimateIn>
        <h1 className="font-display text-3xl font-700">Premium</h1>
        <p className="mt-2 text-sm text-muted">
          Les fonctions essentielles de suivi restent gratuites. Premium ajoute
          profondeur IA, nutrition et personnalisation.
        </p>
      </AnimateIn>

      <AnimateIn delay={0.1} className="mt-6 grid gap-4">
        <div className="rounded-[1.4rem] bg-surface p-5">
          <h2 className="font-display text-lg font-700">Gratuit</h2>
          <ul className="mt-3 space-y-2">
            {free.map((f) => (
              <li key={f} className="flex gap-2 text-sm">
                <IconCheck size={18} className="shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.4rem] border border-accent/40 bg-accent/10 p-5">
          <h2 className="font-display text-lg font-700 text-accent">Premium</h2>
          <ul className="mt-3 space-y-2">
            {premium.map((f) => (
              <li key={f} className="flex gap-2 text-sm">
                <IconCheck size={18} className="shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="mt-5" variant="accent" onClick={togglePremium}>
            {user?.isPremium
              ? "Désactiver Premium (démo)"
              : "Activer Premium (démo locale)"}
          </Button>
          <p className="mt-3 text-[11px] text-muted">
            En production : Stripe / RevenueCat + vérification serveur. Ici, toggle
            local pour tester l&apos;UI.
          </p>
        </div>
      </AnimateIn>
    </main>
  );
}
