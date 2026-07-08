"use client";

// Block-world journey map: chunky platforms, voxel path, and a bobbing avatar
// so the progression feels closer to Roblox / Minecraft lobbies than a travel atlas.

import { MAP_REGIONS, getAvatar } from "@/lib/scenarios";
import { useProfile } from "@/lib/useStore";

/** Platform positions across the block-world stage (percent). */
const PIN_X = [10, 28, 46, 64, 80, 93];
const PIN_Y = [70, 48, 66, 40, 58, 34];

export default function WorldMap() {
  const profile = useProfile();
  const progress = profile?.mapProgress ?? 0;
  const avatar = getAvatar(profile?.avatarId ?? "explorer");
  const current = MAP_REGIONS[Math.min(progress, MAP_REGIONS.length - 1)];
  const nextStop =
    progress < MAP_REGIONS.length - 1 ? MAP_REGIONS[progress + 1] : null;

  return (
    <div className="world-map-wrap">
      <section className="block-world p-4 pb-5 sm:p-5 sm:pb-6" aria-label="Your adventure world">
      {/* Pixel clouds + chunky sun */}
      <div className="block-world__clouds" aria-hidden>
        <span className="block-sun" />
        <span className="block-cloud block-cloud--a" />
        <span className="block-cloud block-cloud--b" />
        <span className="block-cloud block-cloud--c" />
      </div>

      {/* Dirt / grass ground strip */}
      <div className="block-world__ground" aria-hidden />

      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow-[2px_2px_0_#0006]">
            Adventure World
          </p>
          <h2 className="text-xl font-extrabold text-white drop-shadow-[3px_3px_0_#0005] sm:text-2xl">
            Your Quest Map
          </h2>
        </div>
        <div className="block-hud-chip">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-brand-800">
            Checkpoint
          </p>
          <p className="text-sm font-extrabold text-accent-800">
            {current.emoji} {current.name}
          </p>
        </div>
      </div>

      {/* Stage with platforms */}
      <div className="relative z-10 mx-auto min-h-[220px] w-full sm:min-h-[260px]">
        {/* Voxel stepping-stone path between platforms */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          {PIN_X.slice(0, -1).map((x, i) => {
            const lit = i < progress;
            const next = i === progress;
            const x2 = PIN_X[i + 1];
            const y1 = PIN_Y[i];
            const y2 = PIN_Y[i + 1];
            const midX = (x + x2) / 2;
            const midY = (y1 + y2) / 2;
            return (
              <g key={`bridge-${i}`}>
                <line
                  x1={x}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={lit ? "#f59e0b" : next ? "#ffffffaa" : "#ffffff55"}
                  strokeWidth={lit ? 2.8 : 2}
                  strokeDasharray={lit ? "0" : "3 3"}
                  strokeLinecap="square"
                  className={next ? "block-path-dash" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
                {/* Midway block nugget */}
                <rect
                  x={midX - 1.2}
                  y={midY - 1.2}
                  width="2.4"
                  height="2.4"
                  fill={lit ? "#fbbf24" : "#94a3b8"}
                  stroke="#0f172a66"
                  strokeWidth="0.3"
                  className={next ? "block-nugget-pulse" : undefined}
                />
              </g>
            );
          })}
        </svg>

        <ol className="relative h-full min-h-[220px] list-none sm:min-h-[260px]">
          {MAP_REGIONS.map((region, i) => {
            const reached = i <= progress;
            const here = i === progress;
            const locked = !reached;

            return (
              <li
                key={region.id}
                className={`absolute ${here ? "z-20" : reached ? "z-10" : "z-[5]"}`}
                style={{
                  left: `${PIN_X[i]}%`,
                  top: `${PIN_Y[i]}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`block-pad ${
                    here
                      ? "block-pad--here"
                      : reached
                        ? "block-pad--open"
                        : "block-pad--locked"
                  }`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {here && (
                    <span
                      className="block-player"
                      title="You are here"
                      aria-label="You are here"
                    >
                      {avatar?.emoji ?? "🧑‍🚀"}
                    </span>
                  )}

                  {/* Chunky 3D platform with city texture on the face */}
                  <div className="block-pad__stack">
                    <div
                      className="block-pad__face"
                      style={{ backgroundImage: `url(${region.imageUrl})` }}
                      role="img"
                      aria-label={region.name}
                    >
                      <span
                        className={`block-pad__overlay ${locked ? "block-pad__overlay--lock" : ""}`}
                        aria-hidden
                      />
                      <span className="block-pad__icon" aria-hidden>
                        {locked ? "🔒" : region.emoji}
                      </span>
                      {here && <span className="block-pad__spark" aria-hidden />}
                    </div>
                    <div className="block-pad__side" aria-hidden />
                    <div className="block-pad__bottom" aria-hidden />
                  </div>

                  <span
                    className={`block-pad__label ${
                      here
                        ? "block-pad__label--here"
                        : reached
                          ? "block-pad__label--open"
                          : "block-pad__label--locked"
                    }`}
                  >
                    {region.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      </section>

      <p className="block-quest-caption" role="status">
        <span className="block-quest-caption__blurb">{current.blurb}</span>
        <span className="block-quest-caption__sep" aria-hidden>
          ·
        </span>
        <span className="block-quest-caption__hint">
          {nextStop
            ? `Clear chats to unlock ${nextStop.name} ${nextStop.emoji}`
            : "World complete — keep chatting!"}
        </span>
      </p>
    </div>
  );
}
