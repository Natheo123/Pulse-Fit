"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  AmbientGlow,
  AnimateIn,
  PulseRing,
} from "@/components/gsap/AnimateIn";
import { LogoMark } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";

const PILLARS = [
  { k: "01", t: "Programme", d: "Adapté à ton niveau et ton matériel" },
  { k: "02", t: "Séance live", d: "Série par série, repos guidé" },
  { k: "03", t: "Progression", d: "PR, volume, conseils explicables" },
];

export default function LandingPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const heroRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    router.replace(user.onboardingComplete ? "/home" : "/onboarding");
  }, [user, router]);

  useEffect(() => {
    const mark = markRef.current;
    const hero = heroRef.current;
    if (!mark || !hero) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mark,
        { scale: 0.7, opacity: 0, rotate: -12 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.55)",
          delay: 0.15,
        }
      );
      gsap.to(mark, {
        y: -10,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.3,
      });
      gsap.fromTo(
        hero.querySelectorAll("[data-pillar]"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.55,
          delay: 0.55,
          ease: "power3.out",
        }
      );
    }, hero);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={heroRef}
      className="pf-mesh relative flex min-h-dvh flex-col overflow-hidden px-6 pb-8 pt-9"
    >
      <AmbientGlow />

      <AnimateIn>
        <div className="flex items-center justify-between">
          <p className="pf-eyebrow">PulseFit</p>
          <Link
            href="/login"
            className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-700 backdrop-blur"
          >
            Connexion
          </Link>
        </div>
      </AnimateIn>

      {/* Brand as hero signal */}
      <AnimateIn delay={0.06} className="mt-10">
        <h1 className="pf-title text-center text-[3.15rem] leading-[0.95] sm:text-6xl">
          Pulse
          <span className="text-accent">Fit</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[17.5rem] text-center text-[15px] leading-relaxed text-muted">
          L’entraînement premium qui te dit quoi faire, pourquoi, et comment
          progresser.
        </p>
      </AnimateIn>

      <div className="relative mt-8 flex justify-center">
        <div
          className="animate-breathe absolute inset-0 m-auto h-44 w-44 rounded-full bg-accent/25 blur-3xl"
          aria-hidden
        />
        <div ref={markRef} className="relative text-accent">
          <LogoMark size={168} />
        </div>
      </div>

      <div className="mt-10 space-y-2.5">
        {PILLARS.map((p) => (
          <div
            key={p.k}
            data-pillar
            className="pf-glass flex items-center gap-3 rounded-2xl px-3.5 py-3 opacity-0"
          >
            <span className="font-display text-sm font-800 text-accent">{p.k}</span>
            <div>
              <p className="text-sm font-700">{p.t}</p>
              <p className="text-[11px] text-muted">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-10">
        <AnimateIn delay={0.35}>
          <Link href="/register" className="relative block">
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <PulseRing className="!inset-auto h-12 w-[90%] rounded-full" />
            </span>
            <Button variant="accent" className="relative">
              Commencer gratuitement
            </Button>
          </Link>
        </AnimateIn>
        <AnimateIn delay={0.42}>
          <p className="text-center text-[11px] text-muted">
            Sans carte bancaire · Hors ligne pour tes séances
          </p>
        </AnimateIn>
        </div>
      </main>
  );
}
