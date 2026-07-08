"use client";

// Hero header showing the learner's avatar, level, and XP progress to the next
// map stop.

import ScreenTimeChip from "@/components/ScreenTimeChip";
import { XP_PER_LEVEL } from "@/lib/constants";
import { getAvatar } from "@/lib/scenarios";
import { useProfile } from "@/lib/useStore";

export default function PlayerHero() {
  const profile = useProfile();
  const avatar = getAvatar(profile?.avatarId ?? "explorer");
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const intoLevel = xp % XP_PER_LEVEL;
  const pct = Math.round((intoLevel / XP_PER_LEVEL) * 100);

  return (
    <section className="game-card flex items-start gap-4 p-5">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[0.4rem] border-[3px] border-accent-200 bg-brand-100 text-4xl shadow-[inset_0_-4px_0_#00000012]">
        <span aria-hidden>{avatar?.emoji ?? "🧑‍🚀"}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-extrabold text-accent-800 sm:text-xl">
          Welcome back, Crafter!
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500">Lvl {level}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-success-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-400">
            {intoLevel}/{XP_PER_LEVEL} XP
          </span>
        </div>
      </div>
      <ScreenTimeChip />
    </section>
  );
}
