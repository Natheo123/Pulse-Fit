"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { IconLeaf } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import {
  analyzeMeal,
  suggestMeals,
  type MealCategory,
  type MacroResult,
} from "@/lib/nutrition";
import { useAppStore } from "@/lib/store/useAppStore";

const CATEGORIES: { id: MealCategory | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "plat", label: "Plats" },
  { id: "shaker", label: "Shakers" },
  { id: "dessert", label: "Desserts" },
  { id: "petit_dej", label: "Petit-déj" },
  { id: "collation", label: "Collations" },
];

export default function NutritionPage() {
  const user = useAppStore((s) => s.user);
  const [tab, setTab] = useState<"analyze" | "ideas">("ideas");
  const [mealText, setMealText] = useState(
    "150g poulet\n150g riz\n150g brocoli\n10g huile d'olive"
  );
  const [result, setResult] = useState<MacroResult | null>(null);
  const [category, setCategory] = useState<MealCategory | "all">("plat");

  const ideas = useMemo(
    () => suggestMeals(category, user?.goals?.[0]),
    [category, user]
  );

  const proteinTarget =
    user?.goals.includes("build_muscle") || user?.goals.includes("strength")
      ? "1.6–2.2 g/kg"
      : "1.4–1.8 g/kg";

  function runAnalyze() {
    setResult(analyzeMeal(mealText));
  }

  return (
    <main className="pf-mesh relative px-5 pb-6 pt-8">
      <AnimateIn>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[0_0_24px_var(--pf-glow)]">
          <IconLeaf size={24} />
        </div>
        <p className="pf-eyebrow mt-4">Nutrition</p>
        <h1 className="pf-title mt-1.5 text-3xl">Coach nutrition</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Idées de plats préparés avec photos, ou analyse rapide de tes macros.
        </p>
      </AnimateIn>

      <div className="mt-5 flex gap-2 rounded-2xl bg-surface p-1">
        <button
          type="button"
          onClick={() => setTab("ideas")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${
            tab === "ideas" ? "bg-accent text-accent-contrast" : "text-muted"
          }`}
        >
          Plats prêts
        </button>
        <button
          type="button"
          onClick={() => setTab("analyze")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${
            tab === "analyze" ? "bg-accent text-accent-contrast" : "text-muted"
          }`}
        >
          Analyser
        </button>
      </div>

      <AnimateIn className="mt-4 rounded-2xl bg-surface px-4 py-3">
        <p className="text-xs text-muted">Repère protéines</p>
        <p className="font-display text-lg font-700">{proteinTarget}</p>
      </AnimateIn>

      {tab === "ideas" ? (
        <AnimateIn delay={0.08} className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  category === c.id
                    ? "bg-accent text-accent-contrast"
                    : "bg-surface text-muted"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {ideas.map((meal) => (
              <article
                key={meal.id}
                className="overflow-hidden rounded-[1.4rem] bg-surface"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
                  <Image
                    src={meal.image}
                    alt={meal.title}
                    fill
                    sizes="(max-width: 430px) 100vw, 400px"
                    className="object-cover"
                    priority={meal.category === "plat"}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {meal.category.replace("_", "-")}
                    </p>
                    <h3 className="font-display text-xl font-800 text-white">
                      {meal.title}
                    </h3>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-700 text-accent backdrop-blur">
                    {meal.approx.protein}g P
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-sm text-muted">{meal.description}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                    Ingrédients
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {meal.ingredients.map((ing) => (
                      <li key={ing} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                    <span>{meal.approx.kcal} kcal</span>
                    <span>·</span>
                    <span>G {meal.approx.carbs}g</span>
                    <span>·</span>
                    <span>L {meal.approx.fat}g</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMealText(meal.ingredients.join("\n"));
                      setTab("analyze");
                      setResult(analyzeMeal(meal.ingredients.join("\n")));
                    }}
                    className="mt-3 text-sm font-semibold text-accent"
                  >
                    Analyser ce repas →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </AnimateIn>
      ) : (
        <AnimateIn delay={0.08} className="mt-5 space-y-4">
          <div>
            <label className="text-sm text-muted">
              Liste des ingrédients (un par ligne, avec quantités)
            </label>
            <textarea
              value={mealText}
              onChange={(e) => setMealText(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent"
              placeholder={"150g poulet\n100g riz\n1 banane"}
            />
          </div>
          <Button variant="accent" onClick={runAnalyze}>
            Analyser les macros
          </Button>

          {result ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MacroChip label="Calories" value={`${result.kcal}`} unit="kcal" />
                <MacroChip label="Protéines" value={`${result.protein}`} unit="g" accent />
                <MacroChip label="Glucides" value={`${result.carbs}`} unit="g" />
                <MacroChip label="Lipides" value={`${result.fat}`} unit="g" />
              </div>

              <div className="rounded-[1.35rem] bg-surface p-4">
                <p className="text-sm font-semibold">Détail</p>
                <ul className="mt-3 space-y-2">
                  {result.items.map((item, i) => (
                    <li
                      key={`${item.name}-${i}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {item.name}
                        <span className="text-muted">
                          {" "}
                          · {item.grams}
                          {item.matched ? "" : " ?"}
                        </span>
                      </span>
                      <span className="text-muted">
                        {item.matched
                          ? `${item.protein}g P · ${item.kcal} kcal`
                          : "non reconnu"}
                      </span>
                    </li>
                  ))}
                </ul>
                {result.unmatched.length > 0 ? (
                  <p className="mt-3 text-xs text-warning">
                    Non reconnus : {result.unmatched.join(", ")}.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </AnimateIn>
      )}
    </main>
  );
}

function MacroChip({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 ${
        accent ? "bg-accent text-accent-contrast" : "bg-surface"
      }`}
    >
      <p className={`text-xs ${accent ? "text-black/60" : "text-muted"}`}>
        {label}
      </p>
      <p className="font-display mt-1 text-2xl font-700">
        {value}
        <span className="ml-1 text-sm font-500">{unit}</span>
      </p>
    </div>
  );
}
