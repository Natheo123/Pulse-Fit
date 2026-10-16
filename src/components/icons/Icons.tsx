import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function LogoMark({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
    >
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeDasharray="420 80"
        strokeLinecap="round"
        transform="rotate(-40 100 100)"
      />
      <path
        d="M78 118c8-28 18-46 28-54 6 14 10 34 8 58"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M106 122c18-6 34-4 44 6"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="108" cy="62" r="10" fill="currentColor" />
      <path
        d="M86 90c12 4 22 8 28 18"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </svg>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
      <path d="M9 14.5l2 2 4-4" />
    </svg>
  );
}

export function IconDumbbell(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 9v6M18 9v6M3 10.5v3M21 10.5v3M6 12h12M8.5 8v8M15.5 8v8" />
    </svg>
  );
}

export function IconUser(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.8-3.5 4.2-5 7-5s5.2 1.5 7 5" />
    </svg>
  );
}

export function IconChart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 19h16" />
      <path d="M7 16V10M12 16V6M17 16v-4" />
    </svg>
  );
}

export function IconBack(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function IconChevron(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPause(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="7" y="6" width="3.5" height="12" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5v-7z" />
    </svg>
  );
}

export function IconLeaf(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 19c8-1 13-7 14-14-7 1-13 6-14 14z" />
      <path d="M5 19c3-4 7-7 12-9" />
    </svg>
  );
}

export function IconSettings(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.8 7.2l1.9 1.1M17.3 15.7l1.9 1.1M4.8 16.8l1.9-1.1M17.3 8.3l1.9-1.1" />
    </svg>
  );
}

export function IconFlame(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3c2 3 1 5 3 7a5 5 0 1 1-8.5-3.5C8 8 9 6 12 3z" />
    </svg>
  );
}

export function IconMuscle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 14c2-1 3-3 4-3s2 2 4 2 3-3 5-2 2 4 1 6-4 4-7 3-5-2-7-6z" />
      <path d="M14 10c1-2 3-3 5-2" />
    </svg>
  );
}

export function IconScale(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v16M7 8h10" />
      <path d="M7 8c-2 3-2 6 0 6M17 8c2 3 2 6 0 6" />
    </svg>
  );
}

export function IconShare(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v10" />
      <path d="M8 7.5 12 3.5 16 7.5" />
      <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" />
    </svg>
  );
}

export function IconOffline(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 8c5-4 15-4 20 0" />
      <path d="M5 11.5c3.5-2.5 10.5-2.5 14 0" />
      <path d="M8.5 15c2-1.4 5-1.4 7 0" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <path d="M4 4l16 16" />
    </svg>
  );
}
