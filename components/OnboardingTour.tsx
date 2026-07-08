"use client";

// First-visit modal: school-student positioning + Screen-Time Shop intro.

import Link from "next/link";
import { useEffect, useState } from "react";
import { REDEEM_RATE } from "@/lib/constants";

const ONBOARDING_KEY = "lingocraft.onboarding-complete";

export default function OnboardingTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(ONBOARDING_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function finish() {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-accent-900/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="game-card w-full max-w-sm p-6 text-center">
        <p className="text-4xl" aria-hidden>
          ⛏️
        </p>
        <h2
          id="onboarding-title"
          className="mt-3 text-lg font-extrabold text-accent-800 pixel-title"
        >
          Welcome to LINGOCRAFT
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Chat with characters to mine <strong>💎 Gems</strong>. Trade them at
          the <strong>Loot Shop</strong> 🎮 for screen time (
          {REDEEM_RATE.coins} gems = {REDEEM_RATE.minutes} min).
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={finish}
            className="block-btn flex-1 bg-success-500 text-white"
          >
            ▶ Play
          </button>
          <Link
            href="/shop"
            onClick={finish}
            className="block-btn flex-1 bg-accent-600 text-white"
          >
            Loot Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
