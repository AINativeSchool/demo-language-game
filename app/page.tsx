// Home screen: player hero, world map, and scenario picker.

import PlayerHero from "@/components/PlayerHero";
import ScenarioPicker from "@/components/ScenarioPicker";
import WorldMap from "@/components/WorldMap";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PlayerHero />
      <WorldMap />
      <ScenarioPicker />
    </div>
  );
}
