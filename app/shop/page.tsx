// Shop page: Screen-Time Shop plus avatar unlocks.

import AvatarPicker from "@/components/AvatarPicker";
import RedeemPanel from "@/components/RedeemPanel";
import SchoolBadge from "@/components/SchoolBadge";

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-extrabold text-accent-800 pixel-shadow">
          Screen-Time Shop 🎮
        </h1>
        <SchoolBadge />
      </div>
      <RedeemPanel />
      <AvatarPicker />
    </div>
  );
}
