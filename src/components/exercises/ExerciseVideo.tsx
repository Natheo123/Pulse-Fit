"use client";

import { useEffect, useRef, useState } from "react";

export function youtubeThumb(videoId?: string, quality: "hq" | "max" = "hq") {
  if (!videoId) return null;
  return quality === "max"
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function DemoLoop({
  demoVideo,
  demoUrl,
  title,
  className = "",
  eager = false,
}: {
  demoVideo?: string;
  demoUrl?: string;
  title: string;
  className?: string;
  /** Charger immédiatement (fiche détail) */
  eager?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (eager || !demoVideo || !wrapRef.current) return;
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
        else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.2, rootMargin: "80px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [demoVideo, eager]);

  useEffect(() => {
    if (!active || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [active]);

  if (demoVideo) {
    return (
      <div
        ref={wrapRef}
        className={`relative overflow-hidden bg-[#ebebeb] ${className}`}
      >
        {active ? (
          <video
            ref={videoRef}
            src={demoVideo}
            poster={demoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload={eager ? "auto" : "metadata"}
            aria-label={`Démo — ${title}`}
            className="h-full w-full object-contain"
          />
        ) : demoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={demoUrl}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Démo
          </div>
        )}
      </div>
    );
  }

  if (demoUrl) {
    return (
      <div className={`relative overflow-hidden bg-[#f4f4f5] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={demoUrl}
          alt={`Démo — ${title}`}
          className="h-full w-full object-contain p-1"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-surface text-xs text-muted ${className}`}
    >
      Démo
    </div>
  );
}

/** Miniature carte — vidéo 3D lazy en boucle */
export function ExerciseThumb({
  demoUrl,
  demoVideo,
  videoId,
  title,
  className = "",
}: {
  demoUrl?: string;
  demoVideo?: string;
  videoId?: string;
  title: string;
  className?: string;
}) {
  if (demoVideo || demoUrl) {
    return (
      <DemoLoop
        demoVideo={demoVideo}
        demoUrl={demoUrl}
        title={title}
        className={className}
      />
    );
  }

  const src = youtubeThumb(videoId);
  return (
    <div
      className={`relative overflow-hidden bg-[#121214] ${className}`}
      aria-label={`Démo ${title}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted">
          Démo
        </div>
      )}
    </div>
  );
}

export function ExerciseVideo({
  demoUrl,
  demoVideo,
  videoId,
  title,
  className = "",
  mode = "player",
}: {
  demoUrl?: string;
  demoVideo?: string;
  videoId?: string;
  title: string;
  className?: string;
  mode?: "player" | "loop";
}) {
  const [showYt, setShowYt] = useState(false);

  if (mode === "loop") {
    if (!demoVideo && !demoUrl && !videoId) {
      return (
        <div
          className={`flex aspect-[4/3] items-center justify-center bg-surface text-sm text-muted ${className}`}
        >
          Démo bientôt disponible
        </div>
      );
    }

    return (
      <DemoLoop
        demoVideo={demoVideo}
        demoUrl={demoUrl}
        title={title}
        eager
        className={`aspect-[4/3] sm:aspect-[5/4] ${className}`}
      />
    );
  }

  if (showYt && videoId) {
    const playerSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
    return (
      <div className={`overflow-hidden rounded-[1.25rem] bg-black ${className}`}>
        <div className="aspect-video">
          <iframe
            title={`Tutoriel — ${title}`}
            src={playerSrc}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowYt(false)}
          className="w-full bg-surface py-2 text-center text-[11px] font-800 text-muted"
        >
          Revenir à la démo
        </button>
      </div>
    );
  }

  if (!demoVideo && !demoUrl && !videoId) {
    return (
      <div
        className={`flex aspect-video items-center justify-center rounded-[1.25rem] bg-surface text-sm text-muted ${className}`}
      >
        Vidéo bientôt disponible
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[1.25rem] border border-border ${className}`}
    >
      <DemoLoop
        demoVideo={demoVideo}
        demoUrl={demoUrl}
        title={title}
        eager
        className="aspect-[4/3]"
      />
      {videoId ? (
        <button
          type="button"
          onClick={() => setShowYt(true)}
          className="flex w-full items-center justify-center gap-2 bg-surface py-2.5 text-[11px] font-800 text-accent"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Voir le tutoriel vidéo
        </button>
      ) : null}
    </div>
  );
}
