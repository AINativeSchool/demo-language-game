"use client";

// Displays the learner's current gem balance, kept in sync with the store.

import { useProfile } from "@/lib/useStore";

export default function CoinBadge() {
  const profile = useProfile();
  const coins = profile?.coins ?? 0;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-[0.35rem] border-2 border-success-700/40 bg-success-400 px-2.5 py-1 text-sm font-extrabold text-success-800 shadow-[0_3px_0_0_var(--color-success-600)]">
      <span aria-hidden>💎</span>
      <span suppressHydrationWarning>{coins}</span>
    </span>
  );
}
