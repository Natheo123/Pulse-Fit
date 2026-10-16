"use client";

import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store/useAppStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme.mode, theme.accent);
  }, [theme.mode, theme.accent]);

  return <>{children}</>;
}
