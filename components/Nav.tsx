"use client";

// Top navigation bar with brand, primary links, and the live coin balance.

import Link from "next/link";
import { usePathname } from "next/navigation";
import CoinBadge from "./CoinBadge";
import SchoolBadge from "./SchoolBadge";

const LINKS = [
  { href: "/", label: "World", emoji: "🗺️" },
  { href: "/vocabulary", label: "Loot", emoji: "📦" },
  { href: "/shop", label: "Shop", emoji: "🎮" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-white/85 shadow-[0_6px_20px_-8px_#4c1d9540] backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grass-block shrink-0" aria-hidden />
          <div className="flex flex-col gap-1">
            <span className="brand-logo text-sm leading-none sm:text-base">
              LINGOCRAFT
            </span>
            <SchoolBadge />
          </div>
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
                    ? "bg-accent-600 text-white shadow-[0_3px_0_0_var(--color-accent-700)]"
                    : "text-accent-800 hover:bg-accent-100"
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
