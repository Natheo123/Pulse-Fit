"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import gsap from "gsap";

export type ChartPoint = {
  label: string;
  value: number;
};

/**
 * Graphique style apps fitness (Lyfta / Strong) :
 * grille, aire dégradée, courbe, points, axes.
 */
export function ProgressChart({
  points,
  unit = "kg",
  height = 180,
  className = "",
  animate = true,
}: {
  points: ChartPoint[];
  unit?: string;
  height?: number;
  className?: string;
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

  const data = points.length
    ? points
    : [
        { label: "1", value: 20 },
        { label: "2", value: 22 },
        { label: "3", value: 22.5 },
        { label: "4", value: 25 },
        { label: "5", value: 27.5 },
        { label: "6", value: 30 },
      ];

  const pad = { t: 16, r: 12, b: 28, l: 36 };
  const w = 320;
  const h = height;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const { minY, maxY, line, area, coords, gridYs } = useMemo(() => {
    const vals = data.map((d) => d.value);
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    if (min === max) {
      min = Math.max(0, min - 5);
      max = max + 5;
    }
    const span = max - min;
    min = Math.max(0, min - span * 0.12);
    max = max + span * 0.12;

    const coords = data.map((d, i) => {
      const x =
        pad.l +
        (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
      const y = pad.t + (1 - (d.value - min) / (max - min)) * innerH;
      return { x, y, ...d };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(" ");
    const area = `${line} L${coords[coords.length - 1].x},${pad.t + innerH} L${coords[0].x},${pad.t + innerH} Z`;

    const gridYs = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: pad.t + t * innerH,
      v: max - t * (max - min),
    }));

    return { minY: min, maxY: max, line, area, coords, gridYs };
  }, [data, innerH, innerW]);

  useEffect(() => {
    if (!animate) return;
    const path = pathRef.current;
    const areaEl = areaRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.05, ease: "power2.out" }
      );
      if (areaEl) {
        gsap.fromTo(
          areaEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, delay: 0.25, ease: "power1.out" }
        );
      }
    });
    return () => ctx.revert();
  }, [animate, line]);

  const latest = data[data.length - 1]?.value;
  const delta =
    data.length > 1 ? data[data.length - 1].value - data[0].value : 0;

  return (
    <div className={`overflow-hidden rounded-[1.35rem] pf-card p-3.5 ${className}`}>
      <div className="mb-2 flex items-end justify-between px-1">
        <div>
          <p className="text-[10px] font-700 uppercase tracking-[0.16em] text-muted">
            Progression
          </p>
          <p className="font-display mt-0.5 text-2xl font-800 tabular-nums">
            {latest}
            <span className="ml-1 text-sm font-semibold text-muted">{unit}</span>
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-800 ${
            delta >= 0
              ? "bg-accent/15 text-accent"
              : "bg-danger/15 text-danger"
          }`}
        >
          {delta >= 0 ? "+" : ""}
          {Math.round(delta * 10) / 10} {unit}
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Graphique de progression">
        <defs>
          <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pf-accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--pf-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--pf-accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--pf-accent)" />
          </linearGradient>
        </defs>

        {gridYs.map((g, i) => (
          <g key={i}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={g.y}
              y2={g.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={pad.l - 6}
              y={g.y + 3}
              textAnchor="end"
              fill="var(--pf-text-muted)"
              fontSize="9"
              fontFamily="var(--font-outfit), sans-serif"
            >
              {Math.round(g.v)}
            </text>
          </g>
        ))}

        <path ref={areaRef} d={area} fill={`url(#fill-${uid})`} />
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke={`url(#stroke-${uid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y}
              r="4.5"
              fill="var(--pf-bg)"
              stroke="var(--pf-accent)"
              strokeWidth="2"
            />
            <text
              x={c.x}
              y={h - 8}
              textAnchor="middle"
              fill="var(--pf-text-muted)"
              fontSize="9"
              fontFamily="var(--font-outfit), sans-serif"
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>

      <p className="mt-1 px-1 text-[10px] text-muted">
        Plage {Math.round(minY)}–{Math.round(maxY)} {unit} · {data.length} points
      </p>
    </div>
  );
}
