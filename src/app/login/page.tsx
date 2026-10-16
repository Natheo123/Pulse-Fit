"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AmbientGlow, AnimateIn } from "@/components/gsap/AnimateIn";
import { IconBack } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/PasswordField";
import { useAppStore } from "@/lib/store/useAppStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const user = useAppStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login(email, password);
    const next = useAppStore.getState().user;
    router.push(next?.onboardingComplete ? "/home" : "/onboarding");
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
          Connexion
        </h1>
        <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-muted">
          Retrouve tes séances, stats et programmes — partout, hors-ligne
          inclus.
        </p>
      </AnimateIn>

      <form onSubmit={onSubmit} className="relative mt-8 space-y-4">
        <AnimateIn delay={0.08}>
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
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.22} className="pt-2">
          <Button
            type="submit"
            variant="accent"
            className="shadow-[0_10px_32px_var(--pf-glow)]"
          >
            Se connecter
          </Button>
        </AnimateIn>
      </form>

      <p className="relative mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-accent">
          S&apos;inscrire
        </Link>
      </p>
      {user ? (
        <p className="relative mt-2 text-center text-xs text-muted">
          Session locale détectée : {user.email}
        </p>
      ) : null}
    </main>
  );
}
