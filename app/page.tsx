// Home screen: player hero, world-map journey, and the scenario picker.

import PlayerHero from "@/components/PlayerHero";
import WorldMap from "@/components/WorldMap";
import ScenarioPicker from "@/components/ScenarioPicker";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PlayerHero />
      <WorldMap />
      <ScenarioPicker />
    </div>
  );
}
