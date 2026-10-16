"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) {
      setInstalled(true);
      document.documentElement.classList.add("pf-standalone");
      document.querySelector(".pf-app")?.classList.add("pf-standalone");
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed || !deferred) return null;

  return (
    <div className="fixed inset-x-0 bottom-[5.5rem] z-[60] px-4 md:bottom-8">
      <div className="mx-auto flex max-w-[430px] items-center gap-3 rounded-[1.25rem] border border-accent/30 bg-surface/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192.png"
          alt=""
          className="h-11 w-11 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-800">Installer PulseFit</p>
          <p className="text-[11px] text-muted">
            Sur l’écran d’accueil · comme une vraie app
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await deferred.prompt();
            const choice = await deferred.userChoice;
            if (choice.outcome === "accepted") setInstalled(true);
            setDeferred(null);
          }}
          className="shrink-0 rounded-full bg-accent px-3.5 py-2 text-xs font-800 text-accent-contrast"
        >
          Installer
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted"
          aria-label="Fermer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
