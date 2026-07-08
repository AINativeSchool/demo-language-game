"use client";

// Grid of practice scenarios. Scenarios above the learner's level are locked.

import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { useProfile } from "@/lib/useStore";

export default function ScenarioPicker() {
  const profile = useProfile();
  const level = profile?.level ?? 1;

  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-brand-700">
        Choose an Adventure
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {SCENARIOS.map((s) => {
          const locked = level < s.minLevel;
          const cardBody = (
            <div
              className={`game-card flex h-full items-start gap-3 p-4 ${
                locked ? "opacity-60" : "hover:-translate-y-0.5 transition"
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {locked ? "🔒" : s.emoji}
              </span>
              <div>
                <p className="font-extrabold text-slate-800">{s.title}</p>
                <p className="text-sm text-slate-500">{s.description}</p>
                {locked && (
                  <p className="mt-1 text-xs font-bold text-amber-600">
                    Unlocks at level {s.minLevel}
                  </p>
                )}
              </div>
            </div>
          );

          return locked ? (
            <div key={s.id} aria-disabled>
              {cardBody}
            </div>
          ) : (
            <Link key={s.id} href={`/chat?scenario=${s.id}`}>
              {cardBody}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
