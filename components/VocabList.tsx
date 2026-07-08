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
          Chest is empty! Start a quest to mine your first word loot. 📦
        </p>
        <Link
          href="/"
          className="block-btn inline-block bg-accent-600 text-white"
        >
          ▶ Start a Quest
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {vocab.map((w) => (
        <div key={`${w.word}-${w.addedAt}`} className="game-card p-4">
          <p className="text-lg font-extrabold text-success-700">{w.word}</p>
          <p className="text-sm text-slate-600">{w.meaning}</p>
          {w.example && (
            <p className="mt-1 text-xs italic text-slate-500">“{w.example}”</p>
          )}
        </div>
      ))}
    </div>
  );
}
