"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/nav/BottomNav";
import { useAppStore } from "@/lib/store/useAppStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setReady(true));
    if (useAppStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!user.onboardingComplete) router.replace("/onboarding");
  }, [ready, user, router]);

  if (!ready || !user?.onboardingComplete) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <div className="pf-safe-bottom">{children}</div>
      <BottomNav />
    </div>
  );
}
