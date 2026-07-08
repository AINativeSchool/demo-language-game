// Shop page: spend coins on avatars/characters and redeem coins for screen-time.

import AvatarPicker from "@/components/AvatarPicker";
import RedeemPanel from "@/components/RedeemPanel";

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-700 pixel-shadow">
          Coin Shop 🛒
        </h1>
        <p className="text-sm text-slate-500">
          Spend the coins you earned from conversations.
        </p>
      </div>
      <RedeemPanel />
      <AvatarPicker />
    </div>
  );
}
