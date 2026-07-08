"use client";

// Tiny homepage chip showing total screen time earned; links to the shop.

import Link from "next/link";
import { useProfile } from "@/lib/useStore";

export default function ScreenTimeChip() {
  const profile = useProfile();
  const minutes = profile?.redeemedMinutes ?? 0;

  return (
    <Link
      href="/shop"
      title="Loot Shop"
      className="inline-flex shrink-0 items-center gap-1 rounded-[0.3rem] border-2 border-accent-200 bg-accent-100 px-2.5 py-1 text-xs font-extrabold text-accent-800 shadow-[0_2px_0_0_var(--color-accent-200)] transition hover:bg-accent-200"
    >
      <span aria-hidden>🎮</span>
      <span suppressHydrationWarning>{minutes} min</span>
    </Link>
  );
}
