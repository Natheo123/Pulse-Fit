"use client";

import { FormEvent, useState } from "react";
import { AnimateIn } from "@/components/gsap/AnimateIn";
import { IconChat } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
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
  const [online] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Salut ! Je suis le coach PulseFit (DeepSeek). Pose une question sur ta séance, un exercice ou ta progression.",
    },
  ]);

  async function ask(question: string) {
    if (!question.trim() || loading || !online) return;

    const nextMessages: Msg[] = [
      ...messages,
      { role: "user", text: question },
    ];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const completed = sessions.filter((s) => s.status === "completed").length;
      const lastRec = recommendations[0];
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          context: {
            name: user?.name,
            level: user?.level,
            goals: user?.goals,
            completedSessions: completed,
            lastRecommendation: lastRec
              ? `${lastRec.explanation} (${lastRec.action} → ${lastRec.suggestedWeight} kg)`
              : undefined,
          },
        }),
      });

      const data = await res.json();
      const text =
        typeof data.text === "string"
          ? data.text
          : data.error ||
            "Le coach n’a pas répondu. Réessaie dans un instant.";

      setMessages((m) => [...m, { role: "assistant", text }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Connexion au coach impossible pour le moment. Vérifie ta connexion.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    void ask(q);
  }

  return (
    <main className="pf-mesh relative flex min-h-[calc(100dvh-5.5rem)] flex-col px-5 pb-4 pt-8">
      <AnimateIn>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[0_0_24px_var(--pf-glow)]">
          <IconChat size={24} />
        </div>
        <p className="pf-eyebrow mt-4">Coach</p>
        <h1 className="pf-title mt-1.5 text-3xl">Assistant IA</h1>
        <p className="mt-2 text-sm text-muted">
          Propulsé par DeepSeek · coaching musculation & nutrition
        </p>
      </AnimateIn>

      {!online ? (
        <p className="mt-4 rounded-2xl bg-danger/15 px-4 py-3 text-sm text-danger">
          Hors ligne — l&apos;assistant est indisponible.
        </p>
      ) : null}

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
            DeepSeek réfléchit…
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={!online || loading}
            onClick={() => void ask(s)}
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
          disabled={!online || loading}
          placeholder="Pose ta question…"
          className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent disabled:opacity-40"
        />
        <Button
          type="submit"
          variant="accent"
          className="w-auto px-4"
          disabled={!online || loading}
        >
          Envoyer
        </Button>
      </form>
    </main>
  );
}
