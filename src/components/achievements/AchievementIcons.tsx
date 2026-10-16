import type { AchievementIcon } from "@/lib/achievements";

export function AchievementGlyph({
  icon,
  size = 22,
}: {
  icon: AchievementIcon;
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "flame":
      return (
        <svg {...props}>
          <path d="M12 3c2 3 1 5-1 7 3 0 6 2 6 6a5 5 0 1 1-10 0c0-4 3-7 5-13z" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg {...props}>
          <path d="M6 8v8M18 8v8M4 10v4M20 10v4M6 12h12" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...props}>
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M7 6H5a2 2 0 0 0 2 4M17 6h2a2 2 0 0 1-2 4" />
        </svg>
      );
    case "medal":
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="5" />
          <path d="M9 13.5 8 21l4-2 4 2-1-7.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "bolt":
    case "zap":
      return (
        <svg {...props}>
          <path d="M13 2 4 14h7l-1 8 10-14h-7l1-6z" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "compass":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 6-6 2 2-6 6-2z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...props}>
          <path d="m3 20 7-12 3 5 2-3 6 10H3z" />
        </svg>
      );
    case "star":
    default:
      return (
        <svg {...props}>
          <path d="m12 3 2.4 5.7L21 9.3l-4.5 4.1L17.8 21 12 17.8 6.2 21l1.3-7.6L3 9.3l6.6-.6L12 3z" />
        </svg>
      );
  }
}

export const TONE_CLASS: Record<string, string> = {
  lime: "from-[#b8ff3c] to-[#6bcb00] text-[#102000]",
  blue: "from-[#5eb0ff] to-[#2a6dff] text-white",
  violet: "from-[#c084fc] to-[#7c3aed] text-white",
  orange: "from-[#ffb020] to-[#f97316] text-[#1a0c00]",
  rose: "from-[#fb7185] to-[#e11d48] text-white",
  cyan: "from-[#22d3ee] to-[#0891b2] text-[#04151a]",
  gold: "from-[#fde68a] to-[#d97706] text-[#1a1000]",
};
