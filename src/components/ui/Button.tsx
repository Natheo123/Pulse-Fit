"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "ghost" | "surface";

const styles: Record<Variant, string> = {
  primary:
    "bg-white text-black shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:bg-zinc-100 active:scale-[0.98]",
  accent:
    "bg-accent text-accent-contrast shadow-[0_10px_36px_var(--pf-glow)] hover:brightness-110 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground border border-border hover:bg-surface/80",
  surface:
    "bg-surface text-foreground border border-border hover:bg-surface-2 active:scale-[0.98]",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-[1.05rem] text-[15px] font-700 tracking-[-0.01em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
