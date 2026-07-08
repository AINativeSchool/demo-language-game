"use client";

// Renders the learner's saved vocabulary collected during conversations.

import Link from "next/link";
import { useVocabulary } from "@/lib/useStore";

export default function VocabList() {
  const vocab = useVocabulary();

  if (vocab.length === 0) {
    return (
      <div className="game-card p-6 text-center">
        <p className="mb-3 text-slate-500">
          No words yet. Chat with a character to start your collection! 📚
        </p>
        <Link
          href="/"
          className="game-btn inline-block bg-brand-500 text-white shadow-[0_5px_0_0_var(--color-brand-700)]"
        >
          Start a chat
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {vocab.map((w) => (
        <div key={`${w.word}-${w.addedAt}`} className="game-card p-4">
          <p className="text-lg font-extrabold text-emerald-700">{w.word}</p>
          <p className="text-sm text-slate-600">{w.meaning}</p>
          {w.example && (
            <p className="mt-1 text-xs italic text-slate-500">“{w.example}”</p>
          )}
        </div>
      ))}
    </div>
  );
}
