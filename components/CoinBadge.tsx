"use client";

// Displays the learner's current coin balance, kept in sync with the store.

import { useProfile } from "@/lib/useStore";

export default function CoinBadge() {
  const profile = useProfile();
  const coins = profile?.coins ?? 0;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-coin px-3 py-1 text-sm font-extrabold text-[#5b4300] shadow-[0_3px_0_0_var(--color-coin-dark)]">
      <span aria-hidden>🪙</span>
      <span suppressHydrationWarning>{coins}</span>
    </span>
  );
}
