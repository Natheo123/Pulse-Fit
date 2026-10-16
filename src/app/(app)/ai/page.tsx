"use client";

import { FormEvent, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { IconChat } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { localCoachReply } from "@/lib/coach";
import { useAppStore } from "@/lib/store/useAppStore";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Je débute, que dois-je faire aujourd'hui ?",
  "Remplace le développé couché, la machine est prise.",
  "Analyse mes dernières séances.",
];

export default function AiPage() {
  const user = useAppStore((s) => s.user);
  const sessions = useAppStore((s) => s.sessions);
  const recommendations = useAppStore((s) => s.recommendations);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Salut ! Je suis le coach PulseFit — 100 % local, sans cloud. Pose une question sur ta séance, un exercice ou ta progression.",
    },
  ]);

  function ask(question: string) {
    if (!question.trim() || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);

    // Petit délai pour le feeling “réponse”
    window.setTimeout(() => {
      const text = localCoachReply(question, {
        name: user?.name,
        level: user?.level,
        goals: user?.goals,
        sessions,
        recommendations,
      });
      setMessages((m) => [...m, { role: "assistant", text }]);
      setLoading(false);
    }, 280);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(q);
  }

  return (
    <main className="pf-mesh relative flex min-h-[calc(100dvh-5.5rem)] flex-col px-5 pb-4 pt-8">
      <AnimateIn>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[0_0_24px_var(--pf-glow)]">
          <IconChat size={24} />
        </div>
        <p className="pf-eyebrow mt-4">Coach</p>
        <h1 className="pf-title mt-1.5 text-3xl">Coach PulseFit</h1>
        <p className="mt-2 text-sm text-muted">
          Conseils locaux · musculation & récupération · marche hors ligne
        </p>
      </AnimateIn>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.role}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-8 bg-accent text-accent-contrast"
                : "mr-4 bg-surface text-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading ? (
          <div className="mr-4 animate-pulse rounded-2xl bg-surface px-4 py-3 text-sm text-muted">
            Le coach réfléchit…
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => ask(s)}
            className="shrink-0 rounded-full bg-surface px-3 py-2 text-xs disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Pose ta question…"
          className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent disabled:opacity-40"
        />
        <Button
          type="submit"
          variant="accent"
          className="w-auto px-4"
          disabled={loading}
        >
          Envoyer
        </Button>
      </form>
    </main>
  );
}
