export type MealCategory = "plat" | "dessert" | "shaker" | "petit_dej" | "collation";

export interface IngredientNutrition {
  name: string;
  aliases: string[];
  /** per 100g or per unit as noted */
  per: "100g" | "unit";
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  defaultGrams: number;
}

export interface ParsedIngredient {
  raw: string;
  name: string;
  grams: number;
  matched?: IngredientNutrition;
}

export interface MacroResult {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  items: Array<{
    name: string;
    grams: number;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    matched: boolean;
  }>;
  unmatched: string[];
}

export interface MealIdea {
  id: string;
  title: string;
  category: MealCategory;
  description: string;
  ingredients: string[];
  /** Photo du plat préparé */
  image: string;
  approx: { kcal: number; protein: number; carbs: number; fat: number };
  tags: string[];
}

export const INGREDIENTS_DB: IngredientNutrition[] = [
  { name: "Poulet", aliases: ["poulet", "blanc de poulet", "chicken"], per: "100g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, defaultGrams: 150 },
  { name: "Bœuf", aliases: ["boeuf", "bœuf", "steak", "viande hachée"], per: "100g", kcal: 250, protein: 26, carbs: 0, fat: 17, defaultGrams: 120 },
  { name: "Saumon", aliases: ["saumon", "salmon"], per: "100g", kcal: 208, protein: 20, carbs: 0, fat: 13, defaultGrams: 150 },
  { name: "Thon", aliases: ["thon", "tuna"], per: "100g", kcal: 116, protein: 26, carbs: 0, fat: 1, defaultGrams: 100 },
  { name: "Œuf", aliases: ["oeuf", "œuf", "oeufs", "œufs", "egg"], per: "unit", kcal: 74, protein: 6.5, carbs: 0.4, fat: 5, defaultGrams: 1 },
  { name: "Riz", aliases: ["riz", "riz blanc", "riz complet"], per: "100g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, defaultGrams: 150 },
  { name: "Pâtes", aliases: ["pates", "pâtes", "pasta", "spaghetti"], per: "100g", kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, defaultGrams: 150 },
  { name: "Avoine", aliases: ["avoine", "flocons d'avoine", "flocons", "oats"], per: "100g", kcal: 389, protein: 17, carbs: 66, fat: 7, defaultGrams: 60 },
  { name: "Patate douce", aliases: ["patate douce", "patates douces"], per: "100g", kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, defaultGrams: 200 },
  { name: "Pomme de terre", aliases: ["pomme de terre", "patate", "pommes de terre"], per: "100g", kcal: 77, protein: 2, carbs: 17, fat: 0.1, defaultGrams: 200 },
  { name: "Brocoli", aliases: ["brocoli", "broccoli"], per: "100g", kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, defaultGrams: 150 },
  { name: "Salade", aliases: ["salade", "laitue", "verdure"], per: "100g", kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, defaultGrams: 80 },
  { name: "Tomate", aliases: ["tomate", "tomates"], per: "100g", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultGrams: 100 },
  { name: "Avocat", aliases: ["avocat"], per: "100g", kcal: 160, protein: 2, carbs: 9, fat: 15, defaultGrams: 80 },
  { name: "Banane", aliases: ["banane", "bananes"], per: "unit", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, defaultGrams: 1 },
  { name: "Pomme", aliases: ["pomme", "pommes"], per: "unit", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, defaultGrams: 1 },
  { name: "Fromage blanc", aliases: ["fromage blanc", "skyr", "faisselle"], per: "100g", kcal: 70, protein: 8, carbs: 4, fat: 2, defaultGrams: 200 },
  { name: "Yaourt grec", aliases: ["yaourt grec", "yaourt", "yogurt", "yoghurt"], per: "100g", kcal: 97, protein: 9, carbs: 3.6, fat: 5, defaultGrams: 150 },
  { name: "Lait", aliases: ["lait", "lait demi-écrémé"], per: "100g", kcal: 46, protein: 3.4, carbs: 5, fat: 1.5, defaultGrams: 250 },
  { name: "Whey", aliases: ["whey", "protéine", "proteine", "protéine en poudre"], per: "100g", kcal: 400, protein: 80, carbs: 8, fat: 5, defaultGrams: 30 },
  { name: "Beurre de cacahuète", aliases: ["beurre de cacahuete", "beurre de cacahuète", "peanut butter"], per: "100g", kcal: 588, protein: 25, carbs: 20, fat: 50, defaultGrams: 20 },
  { name: "Huile d'olive", aliases: ["huile d'olive", "huile olive", "huile"], per: "100g", kcal: 884, protein: 0, carbs: 0, fat: 100, defaultGrams: 10 },
  { name: "Pain complet", aliases: ["pain", "pain complet", "tranche de pain"], per: "100g", kcal: 247, protein: 13, carbs: 41, fat: 3.4, defaultGrams: 60 },
  { name: "Tofu", aliases: ["tofu"], per: "100g", kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, defaultGrams: 150 },
  { name: "Quinoa", aliases: ["quinoa"], per: "100g", kcal: 120, protein: 4.4, carbs: 21, fat: 1.9, defaultGrams: 150 },
  { name: "Fromage", aliases: ["fromage", "emmental", "cheddar"], per: "100g", kcal: 350, protein: 25, carbs: 1, fat: 27, defaultGrams: 30 },
  { name: "Jambon", aliases: ["jambon"], per: "100g", kcal: 145, protein: 21, carbs: 1.5, fat: 6, defaultGrams: 80 },
  { name: "Lentilles", aliases: ["lentilles"], per: "100g", kcal: 116, protein: 9, carbs: 20, fat: 0.4, defaultGrams: 150 },
  { name: "Chocolat noir", aliases: ["chocolat", "chocolat noir"], per: "100g", kcal: 546, protein: 7.8, carbs: 46, fat: 31, defaultGrams: 20 },
  { name: "Miel", aliases: ["miel"], per: "100g", kcal: 304, protein: 0.3, carbs: 82, fat: 0, defaultGrams: 15 },
];

export const MEAL_IDEAS: MealIdea[] = [
  {
    id: "bowl-poulet",
    title: "Bowl poulet riz brocoli",
    category: "plat",
    description: "Repas post-séance équilibré, simple à batch-cook.",
    ingredients: ["150g poulet", "150g riz", "150g brocoli", "10g huile d'olive"],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 520, protein: 48, carbs: 48, fat: 14 },
    tags: ["post-workout", "protéines"],
  },
  {
    id: "wrap-thon",
    title: "Wrap thon œufs",
    category: "plat",
    description: "Rapide, idéal midi ou pré-séance légère.",
    ingredients: ["100g thon", "2 œufs", "60g pain complet", "80g salade", "tomate"],
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 430, protein: 45, carbs: 28, fat: 12 },
    tags: ["rapide"],
  },
  {
    id: "tofu-quinoa",
    title: "Tofu quinoa légumes",
    category: "plat",
    description: "Option végétarienne riche en protéines.",
    ingredients: ["150g tofu", "150g quinoa", "150g brocoli", "huile d'olive"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 460, protein: 28, carbs: 40, fat: 18 },
    tags: ["végétarien"],
  },
  {
    id: "saumon-patate",
    title: "Saumon patate douce",
    category: "plat",
    description: "Oméga-3 + glucides lents.",
    ingredients: ["150g saumon", "200g patate douce", "salade", "huile d'olive"],
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 540, protein: 35, carbs: 42, fat: 24 },
    tags: ["soir"],
  },
  {
    id: "shaker-classique",
    title: "Shaker whey banane",
    category: "shaker",
    description: "Collation express après l'entraînement.",
    ingredients: ["30g whey", "250ml lait", "1 banane"],
    image:
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 340, protein: 36, carbs: 38, fat: 6 },
    tags: ["post-workout", "rapide"],
  },
  {
    id: "shaker-beurre",
    title: "Shaker mass gainer light",
    category: "shaker",
    description: "Plus calorique pour prise de muscle.",
    ingredients: ["30g whey", "250ml lait", "20g beurre de cacahuète", "1 banane"],
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 460, protein: 40, carbs: 40, fat: 16 },
    tags: ["prise de muscle"],
  },
  {
    id: "dessert-skyr",
    title: "Skyr miel chocolat",
    category: "dessert",
    description: "Dessert protéiné anti-fringale.",
    ingredients: ["200g fromage blanc", "15g miel", "20g chocolat noir"],
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 290, protein: 18, carbs: 32, fat: 10 },
    tags: ["soir", "protéines"],
  },
  {
    id: "dessert-yaourt",
    title: "Yaourt grec fruits",
    category: "dessert",
    description: "Léger et rassasiant.",
    ingredients: ["150g yaourt grec", "1 pomme", "avoine 20g"],
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=70",
    approx: { kcal: 260, protein: 15, carbs: 35, fat: 7 },
    tags: ["léger"],
  },
  {
    id: "pdj-avoine",
    title: "Porridge avoine protéiné",
    category: "petit_dej",
    description: "Petit-déj qui tient jusqu'à midi.",
    ingredients: ["60g avoine", "200g fromage blanc", "1 banane", "10g beurre de cacahuète"],
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 520, protein: 30, carbs: 65, fat: 14 },
    tags: ["matin"],
  },
  {
    id: "collation-oeufs",
    title: "Œufs + pain complet",
    category: "collation",
    description: "Snack simple entre deux repas.",
    ingredients: ["2 œufs", "60g pain complet"],
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    approx: { kcal: 300, protein: 20, carbs: 25, fat: 12 },
    tags: ["rapide"],
  },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function parseIngredientLine(line: string): ParsedIngredient {
  const raw = line.trim();
  if (!raw) return { raw, name: "", grams: 0 };

  const qtyMatch = raw.match(
    /^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|cl|l|oeufs?|œufs?|u|x)?\s*(.*)$/i
  );

  let grams = 100;
  let namePart = raw;

  if (qtyMatch) {
    const qty = Number(qtyMatch[1].replace(",", "."));
    const unit = (qtyMatch[2] || "g").toLowerCase();
    namePart = qtyMatch[3] || qtyMatch[0];
    if (unit === "kg") grams = qty * 1000;
    else if (unit === "l") grams = qty * 1000;
    else if (unit === "cl") grams = qty * 10;
    else if (unit === "ml") grams = qty;
    else if (/oeuf|œuf|u|x/.test(unit) || (!qtyMatch[2] && /oeuf|œuf/.test(normalize(raw)))) {
      grams = qty; // units
      namePart = namePart || "œuf";
    } else grams = qty;
  }

  const n = normalize(namePart || raw);
  const matched = INGREDIENTS_DB.find((ing) =>
    ing.aliases.some((a) => n.includes(normalize(a)) || normalize(a).includes(n))
  );

  if (matched?.per === "unit" && !qtyMatch?.[2]) {
    // "2 œufs" already handled; bare "œuf" => 1
    if (!qtyMatch) grams = 1;
  }

  return {
    raw,
    name: matched?.name ?? (namePart || raw),
    grams: matched?.per === "unit" ? grams || 1 : grams || matched?.defaultGrams || 100,
    matched,
  };
}

export function analyzeMeal(text: string): MacroResult {
  const lines = text
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items: MacroResult["items"] = [];
  const unmatched: string[] = [];

  for (const line of lines) {
    const parsed = parseIngredientLine(line);
    if (!parsed.matched) {
      unmatched.push(parsed.raw);
      items.push({
        name: parsed.name || parsed.raw,
        grams: parsed.grams,
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        matched: false,
      });
      continue;
    }
    const m = parsed.matched;
    const factor = m.per === "unit" ? parsed.grams : parsed.grams / 100;
    items.push({
      name: m.name,
      grams: parsed.grams,
      kcal: Math.round(m.kcal * factor),
      protein: Math.round(m.protein * factor * 10) / 10,
      carbs: Math.round(m.carbs * factor * 10) / 10,
      fat: Math.round(m.fat * factor * 10) / 10,
      matched: true,
    });
  }

  return {
    kcal: items.reduce((a, i) => a + i.kcal, 0),
    protein: Math.round(items.reduce((a, i) => a + i.protein, 0) * 10) / 10,
    carbs: Math.round(items.reduce((a, i) => a + i.carbs, 0) * 10) / 10,
    fat: Math.round(items.reduce((a, i) => a + i.fat, 0) * 10) / 10,
    items,
    unmatched,
  };
}

export function suggestMeals(category?: MealCategory | "all", goal?: string) {
  let list = [...MEAL_IDEAS];
  if (category && category !== "all") {
    list = list.filter((m) => m.category === category);
  }
  if (goal === "build_muscle" || goal === "strength") {
    list.sort((a, b) => b.approx.protein - a.approx.protein);
  } else if (goal === "lose_weight") {
    list.sort((a, b) => a.approx.kcal - b.approx.kcal);
  }
  return list;
}
