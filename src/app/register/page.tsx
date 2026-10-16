"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AmbientGlow, AnimateIn } from "@/components/gsap/AnimateIn";
import { IconBack } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { evaluatePassword } from "@/lib/password";
import { useAppStore } from "@/lib/store/useAppStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAppStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const strongEnough = strength.score >= 3;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!strongEnough) {
      setError("Choisis un mot de passe plus solide (au moins 3 critères).");
      return;
    }
    setError("");
    register(email, name, password);
    router.push("/onboarding");
  }

  return (
    <main className="pf-mesh relative flex min-h-dvh flex-col overflow-hidden px-6 pb-8 pt-6">
      <AmbientGlow />

      <Link
        href="/"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface/80 text-foreground backdrop-blur"
      >
        <IconBack size={20} />
      </Link>

      <AnimateIn className="relative mt-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          PulseFit
        </p>
        <h1 className="font-display mt-2 text-3xl font-800 tracking-tight sm:text-4xl">
          Créer un compte
        </h1>
        <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-muted">
          Gratuit pour démarrer. Premium pour l&apos;IA avancée et les plans
          illimités.
        </p>
      </AnimateIn>

      <form onSubmit={onSubmit} className="relative mt-8 space-y-3.5">
        <AnimateIn delay={0.06}>
          <div className="pf-card rounded-[1.4rem] p-4">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Prénom
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border/70 bg-background/50 px-4 py-3.5 outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--pf-glow)]"
              placeholder="Alex"
            />
          </div>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <div className="pf-card rounded-[1.4rem] p-4">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border/70 bg-background/50 px-4 py-3.5 outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--pf-glow)]"
              placeholder="toi@email.com"
            />
          </div>
        </AnimateIn>
        <AnimateIn delay={0.14}>
          <div className="pf-card rounded-[1.4rem] p-4">
            <label
              className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="mt-2">
              <PasswordField
                value={password}
                onChange={setPassword}
                showStrength
                placeholder="Min. 8 caractères"
                minLength={8}
              />
            </div>
          </div>
        </AnimateIn>
        {error ? (
          <p className="rounded-[1.1rem] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </p>
        ) : null}
        <AnimateIn delay={0.2} className="pt-2">
          <Button
            type="submit"
            variant="accent"
            disabled={!strongEnough && password.length > 0}
            className="shadow-[0_10px_32px_var(--pf-glow)]"
          >
            Créer mon compte
          </Button>
        </AnimateIn>
      </form>

      <p className="relative mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
