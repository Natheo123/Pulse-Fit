"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import gsap from "gsap";

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  y = 28,
  scale = 1,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, scale: scale < 1 ? scale : 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, scale, duration]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function useStaggerIn(selector: string, deps: unknown[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll(selector);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 22, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

/** Compteur animé GSAP */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  className = "",
  duration = 1.1,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.n)}${suffix}`;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [value, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/** Carte pressable avec feedback GSAP */
export function Pressable({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const down = () =>
      gsap.to(el, { scale: 0.97, duration: 0.15, ease: "power2.out" });
    const up = () =>
      gsap.to(el, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.45)" });

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/** Orbes ambiants animés en fond */
export function AmbientGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const a = el.querySelector<HTMLElement>("[data-orb='a']");
    const b = el.querySelector<HTMLElement>("[data-orb='b']");
    const ctx = gsap.context(() => {
      if (a) {
        gsap.to(a, {
          x: 40,
          y: -30,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (b) {
        gsap.to(b, {
          x: -35,
          y: 40,
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        data-orb="a"
        className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        data-orb="b"
        className="absolute -right-12 top-40 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />
    </div>
  );
}

/** Pulse léger sur un CTA */
export function PulseRing({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1, opacity: 0.55 },
        {
          scale: 1.55,
          opacity: 0,
          duration: 1.6,
          repeat: -1,
          ease: "power1.out",
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={ref}
      className={`pointer-events-none absolute inset-0 rounded-full bg-accent/40 ${className}`}
      aria-hidden
    />
  );
}
