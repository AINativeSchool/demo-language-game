"use client";

// Shop grid for buying and equipping avatars with coins.

import { AVATARS } from "@/lib/scenarios";
import { buyAvatar, equipAvatar } from "@/lib/store";
import { useProfile } from "@/lib/useStore";

export default function AvatarPicker() {
  const profile = useProfile();
  const coins = profile?.coins ?? 0;
  const owned = profile?.ownedAvatars ?? ["explorer"];
  const equipped = profile?.avatarId ?? "explorer";

  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold text-brand-700">Characters</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AVATARS.map((a) => {
          const isOwned = owned.includes(a.id);
          const isEquipped = equipped === a.id;
          const affordable = coins >= a.cost;

          return (
            <div
              key={a.id}
              className={`game-card flex flex-col items-center p-4 text-center ${
                isEquipped ? "ring-4 ring-grass-400" : ""
              }`}
            >
              <span className="text-4xl" aria-hidden>
                {a.emoji}
              </span>
              <p className="mt-1 font-extrabold text-slate-700">{a.name}</p>

              {isOwned ? (
                <button
                  type="button"
                  onClick={() => equipAvatar(a.id)}
                  disabled={isEquipped}
                  className="game-btn mt-2 w-full bg-grass-500 text-white shadow-[0_5px_0_0_#2b8a45]"
                >
                  {isEquipped ? "Equipped" : "Equip"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => buyAvatar(a.id)}
                  disabled={!affordable}
                  className="game-btn mt-2 w-full bg-coin text-[#5b4300] shadow-[0_5px_0_0_var(--color-coin-dark)]"
                >
                  🪙 {a.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
