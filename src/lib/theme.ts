import type { AccentColor, ThemeMode } from "./types";

export const ACCENT_MAP: Record<AccentColor, string> = {
  lime: "#b5ff33",
  blue: "#3b82f6",
  violet: "#a855f7",
  orange: "#f97316",
  rose: "#f43f5e",
  cyan: "#22d3ee",
};

export function applyTheme(mode: ThemeMode, accent: AccentColor) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.style.setProperty("--pf-accent", ACCENT_MAP[accent]);
}
