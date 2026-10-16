"use client";

import { useState } from "react";
import {
  evaluatePassword,
  STRENGTH_COLOR,
  STRENGTH_LABEL,
} from "@/lib/password";

export function PasswordField({
  value,
  onChange,
  placeholder = "Mot de passe",
  showStrength = false,
  required = true,
  minLength = 8,
  id = "password",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  required?: boolean;
  minLength?: number;
  id?: string;
}) {
  const [visible, setVisible] = useState(false);
  const evaled = evaluatePassword(value);

  return (
    <div>
      <div className="relative mt-1.5">
        <input
          id={id}
          required={required}
          minLength={minLength}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 pr-12 outline-none focus:border-accent"
          placeholder={placeholder}
          autoComplete={showStrength ? "new-password" : "current-password"}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:text-foreground"
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {showStrength && value.length > 0 ? (
        <div className="mt-3 space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition"
                style={{
                  background:
                    i <= evaled.score
                      ? STRENGTH_COLOR[evaled.strength]
                      : "var(--pf-surface-2)",
                }}
              />
            ))}
          </div>
          <p className="text-xs font-semibold" style={{ color: STRENGTH_COLOR[evaled.strength] }}>
            Sécurité : {STRENGTH_LABEL[evaled.strength]}
          </p>
          <ul className="space-y-1">
            {evaled.checks.map((c) => (
              <li
                key={c.label}
                className={`text-xs ${c.ok ? "text-success" : "text-muted"}`}
              >
                {c.ok ? "✓" : "○"} {c.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 004.2 4.2" />
      <path d="M9.9 5.1A11 11 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.1" />
      <path d="M6.1 6.1A17 17 0 002 12s3.5 7 10 7a11 11 0 005-.9" />
    </svg>
  );
}
