"use client";

import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="pf-eyebrow">{children}</p>;
}

export function PageTitle({
  children,
  sub,
}: {
  children: ReactNode;
  sub?: string;
}) {
  return (
    <div>
      <h1 className="pf-title text-3xl sm:text-[2.1rem]">{children}</h1>
      {sub ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{sub}</p> : null}
    </div>
  );
}

export function SoftBadge({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "muted" | "success";
}) {
  const map = {
    accent: "bg-accent text-accent-contrast",
    muted: "bg-background/70 text-muted",
    success: "bg-success/20 text-success",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider ${map[tone]}`}
    >
      {children}
    </span>
  );
}
