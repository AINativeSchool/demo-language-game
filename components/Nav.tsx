"use client";

// Top navigation bar with brand, primary links, and the live coin balance.

import Link from "next/link";
import { usePathname } from "next/navigation";
import CoinBadge from "./CoinBadge";

const LINKS = [
  { href: "/", label: "Map", emoji: "🗺️" },
  { href: "/vocabulary", label: "Words", emoji: "📚" },
  { href: "/shop", label: "Shop", emoji: "🛒" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b-4 border-brand-600/20 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🌍
          </span>
          <span className="text-xl font-extrabold text-brand-600 pixel-shadow">
            LingoQuest
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-2.5 py-1.5 text-sm font-bold transition sm:px-3 ${
                  active
                    ? "bg-brand-500 text-white shadow-[0_3px_0_0_var(--color-brand-700)]"
                    : "text-brand-700 hover:bg-brand-100"
                }`}
              >
                <span className="mr-1" aria-hidden>
                  {link.emoji}
                </span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <CoinBadge />
        </div>
      </nav>
    </header>
  );
}
