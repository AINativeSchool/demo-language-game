"use client";

// Shows the AI's gentle corrections and any new vocabulary from the latest turn.

import type { Correction, VocabWord } from "@/lib/types";

interface FeedbackPanelProps {
  corrections: Correction[];
  newWords: VocabWord[];
}

export default function FeedbackPanel({ corrections, newWords }: FeedbackPanelProps) {
  const hasContent = corrections.length > 0 || newWords.length > 0;

  return (
    <aside className="game-card h-full p-4">
      <h2 className="mb-3 text-base text-accent-800 pixel-title">Guide 🧭</h2>

      {!hasContent && (
        <p className="text-sm text-slate-500">
          Tips and word loot will drop here as you chat. Keep crafting! 💬
        </p>
      )}

      {corrections.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-warning-600">
            Fix it up ✍️
          </h3>
          <ul className="space-y-2">
            {corrections.map((c, i) => (
              <li key={i} className="rounded-xl bg-warning-50 p-2.5 text-sm">
                <p className="text-slate-500 line-through">{c.original}</p>
                <p className="font-bold text-slate-800">{c.suggestion}</p>
                {c.note && <p className="mt-1 text-xs text-slate-500">{c.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {newWords.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-success-600">
            New words 📚
          </h3>
          <ul className="space-y-2">
            {newWords.map((w, i) => (
              <li key={i} className="rounded-xl bg-success-50 p-2.5 text-sm">
                <p className="font-extrabold text-success-800">{w.word}</p>
                <p className="text-slate-600">{w.meaning}</p>
                {w.example && (
                  <p className="mt-1 text-xs italic text-slate-500">“{w.example}”</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
