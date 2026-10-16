"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  IconCalendar,
  IconChart,
  IconDumbbell,
  IconHome,
  IconUser,
} from "@/components/icons/Icons";

const items = [
  { href: "/home", label: "Accueil", Icon: IconHome },
  { href: "/plans", label: "Plans", Icon: IconCalendar },
  { href: "/workout", label: "Séance", Icon: IconDumbbell },
  { href: "/stats", label: "Stats", Icon: IconChart },
  { href: "/profile", label: "Profil", Icon: IconUser },
];

export function BottomNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const activeIndex = Math.max(
    0,
    items.findIndex(
      (it) => pathname === it.href || pathname.startsWith(`${it.href}/`)
    )
  );

  useEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const li = list.children[activeIndex] as HTMLElement | undefined;
    if (!li) return;
    gsap.to(pill, {
      x: li.offsetLeft + 4,
      width: Math.max(li.offsetWidth - 8, 36),
      duration: 0.42,
      ease: "power3.out",
    });
  }, [activeIndex, pathname]);

  return (
    <nav className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0c0c0e]/88 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <span
          ref={pillRef}
          className="pointer-events-none absolute top-1.5 h-12 rounded-[1.15rem] bg-accent/18"
          style={{ left: 0, width: 48 }}
          aria-hidden
        />
        <ul ref={listRef} className="relative grid grid-cols-5 gap-0.5 px-1 py-1.5">
          {items.map(({ href, label, Icon }, i) => {
            const active = i === activeIndex;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-0.5 rounded-[1.1rem] px-1 py-2.5 text-[10px] font-700 transition-colors ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  <Icon size={21} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
