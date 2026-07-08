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
      <h2 className="mb-3 text-base text-accent-800 pixel-title">Skins</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AVATARS.map((a) => {
          const isOwned = owned.includes(a.id);
          const isEquipped = equipped === a.id;
          const affordable = coins >= a.cost;

          return (
            <div
              key={a.id}
              className={`game-card flex flex-col items-center p-4 text-center ${
                isEquipped
                  ? "shadow-[0_6px_0_0_var(--color-success-400),0_12px_24px_-10px_#0d948850]"
                  : ""
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
                  className="block-btn mt-2 w-full bg-success-600 text-white"
                >
                  {isEquipped ? "Equipped" : "Equip"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => buyAvatar(a.id)}
                  disabled={!affordable}
                  className="block-btn mt-2 w-full bg-success-400 text-success-800"
                >
                  💎 {a.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
