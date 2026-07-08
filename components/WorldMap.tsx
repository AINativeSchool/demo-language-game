"use client";

// Visualizes the learner's journey: the avatar sits at the current map region
// and unlocked stops light up as they level up.

import { MAP_REGIONS, getAvatar } from "@/lib/scenarios";
import { useProfile } from "@/lib/useStore";

export default function WorldMap() {
  const profile = useProfile();
  const progress = profile?.mapProgress ?? 0;
  const avatar = getAvatar(profile?.avatarId ?? "explorer");

  return (
    <section className="game-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-brand-700">Your Journey</h2>
        <span className="text-sm font-bold text-slate-500">
          Level {profile?.level ?? 1}
        </span>
      </div>

      <ol className="flex flex-wrap items-stretch gap-2">
        {MAP_REGIONS.map((region, i) => {
          const reached = i <= progress;
          const here = i === progress;
          return (
            <li
              key={region.id}
              className={`relative flex min-w-[92px] flex-1 flex-col items-center rounded-2xl border-2 p-3 text-center transition ${
                reached
                  ? "border-grass-400 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {reached ? region.emoji : "🔒"}
              </span>
              <span className="mt-1 text-xs font-bold text-slate-600">
                {region.name}
              </span>
              {here && (
                <span
                  className="absolute -top-3 text-2xl"
                  title="You are here"
                  aria-label="You are here"
                >
                  {avatar?.emoji ?? "🧑‍🚀"}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-center text-sm text-slate-500">
        Finish conversations to earn XP and travel to the next stop!
      </p>
    </section>
  );
}
