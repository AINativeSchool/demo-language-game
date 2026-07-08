"use client";

// First-visit modal: school-student positioning + Screen-Time Shop intro.

import Link from "next/link";
import { useEffect, useState } from "react";
import { REDEEM_RATE } from "@/lib/constants";

const ONBOARDING_KEY = "lingoquest.onboarding-complete";

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
          🎒
        </p>
        <h2
          id="onboarding-title"
          className="mt-3 text-xl font-extrabold text-accent-800"
        >
          English for school students
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Chat to earn coins. Redeem them at the{" "}
          <strong>Screen-Time Shop</strong> 🎮 ({REDEEM_RATE.coins} coins ={" "}
          {REDEEM_RATE.minutes} min).
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={finish}
            className="game-btn flex-1 bg-white text-accent-800 shadow-[0_4px_0_0_var(--color-accent-200)]"
          >
            Start
          </button>
          <Link
            href="/shop"
            onClick={finish}
            className="game-btn flex-1 bg-accent-600 text-white shadow-[0_5px_0_0_var(--color-accent-700)]"
          >
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
