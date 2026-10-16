export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export function evaluatePassword(password: string): {
  score: number;
  strength: PasswordStrength;
  checks: { label: string; ok: boolean }[];
} {
  const checks = [
    { label: "Au moins 8 caractères", ok: password.length >= 8 },
    { label: "Une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Une minuscule", ok: /[a-z]/.test(password) },
    { label: "Un chiffre", ok: /\d/.test(password) },
    { label: "Un caractère spécial", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const strength: PasswordStrength =
    score <= 2 ? "weak" : score === 3 ? "fair" : score === 4 ? "good" : "strong";
  return { score, strength, checks };
}

export const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: "Faible",
  fair: "Moyen",
  good: "Bon",
  strong: "Fort",
};

export const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  weak: "#f87171",
  fair: "#fbbf24",
  good: "#34d399",
  strong: "var(--pf-accent)",
};
