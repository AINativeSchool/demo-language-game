"use client";

// Converts coins into entertainment/screen-time using the fixed redeem rate.

import { REDEEM_RATE } from "@/lib/constants";
import { redeemCoins } from "@/lib/store";
import { useProfile } from "@/lib/useStore";

export default function RedeemPanel() {
  const profile = useProfile();
  const coins = profile?.coins ?? 0;
  const redeemed = profile?.redeemedMinutes ?? 0;
  const canRedeem = coins >= REDEEM_RATE.coins;

  return (
    <section className="game-card p-5">
      <p className="mb-4 text-sm font-bold text-slate-500">
        💎 {REDEEM_RATE.coins} gems = {REDEEM_RATE.minutes} min screen time
      </p>

      <div className="flex items-center justify-between rounded-[0.5rem] border-2 border-brand-200 bg-brand-50 p-4 shadow-[0_4px_0_0_#fde68a99,0_8px_20px_-10px_#78350f22]">
        <div>
          <p className="text-sm font-bold text-slate-500">Time earned so far</p>
          <p className="text-2xl font-extrabold text-brand-800">
            {redeemed} min
          </p>
        </div>
        <button
          type="button"
          onClick={() => redeemCoins(REDEEM_RATE.coins)}
          disabled={!canRedeem}
          className="block-btn bg-success-600 text-white"
        >
          Trade {REDEEM_RATE.minutes} min
        </button>
      </div>

      {!canRedeem && (
        <p className="mt-3 text-center text-xs font-bold text-warning-600">
          Mine {REDEEM_RATE.coins - coins} more 💎 gems to trade.
        </p>
      )}
    </section>
  );
}
