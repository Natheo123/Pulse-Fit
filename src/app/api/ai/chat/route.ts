import { NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY manquante côté serveur." },
      { status: 500 }
    );
  }

  let body: {
    messages?: ChatMessage[];
    context?: {
      name?: string;
      level?: string | null;
      goals?: string[];
      completedSessions?: number;
      lastRecommendation?: string;
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const userMessages = (body.messages ?? []).filter(
    (m) => m.role === "user" || m.role === "assistant"
  );
  if (!userMessages.length) {
    return NextResponse.json({ error: "Aucun message" }, { status: 400 });
  }

  const ctx = body.context ?? {};
  const system: ChatMessage = {
    role: "system",
    content: [
      "Tu es le coach PulseFit : musculation, nutrition sportive, technique et progression.",
      "Réponds en français, clair, concis (max ~180 mots sauf si on te demande plus).",
      "Ne invente pas de stats personnelles : utilise uniquement le contexte fourni.",
      "Si tu manques d'info, dis-le et propose une action simple.",
      `Contexte athlète : nom=${ctx.name ?? "inconnu"}, niveau=${ctx.level ?? "n/a"}, objectifs=${(ctx.goals ?? []).join(", ") || "n/a"}, séances terminées=${ctx.completedSessions ?? 0}.`,
      ctx.lastRecommendation
        ? `Dernière reco app : ${ctx.lastRecommendation}`
        : "Pas de recommandation de charge récente.",
    ].join("\n"),
  };

  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const trackingId = process.env.DEEPSEEK_TRACKING_ID;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (trackingId) {
    headers["X-Tracking-Id"] = trackingId;
  }

  try {
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [system, ...userMessages.slice(-12)],
        temperature: 0.6,
        max_tokens: 700,
        stream: false,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      const raw =
        data?.error?.message ||
        data?.message ||
        `DeepSeek HTTP ${upstream.status}`;
      const msg =
        upstream.status === 402 || /insufficient balance/i.test(String(raw))
          ? "Crédit DeepSeek insuffisant. Recharge ton compte sur platform.deepseek.com puis réessaie."
          : String(raw);
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Je n’ai pas pu formuler de réponse.";

    return NextResponse.json({
      text,
      model,
      trackingId: trackingId ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur réseau DeepSeek";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
