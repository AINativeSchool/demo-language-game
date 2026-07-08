// Conversation page. Reads the chosen scenario from the query string and hands
// off to the interactive ChatWindow. Falls back to a picker if none is chosen.

import Link from "next/link";
import ChatWindow from "@/components/ChatWindow";
import { SCENARIOS, getScenario } from "@/lib/scenarios";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const { scenario: id } = await searchParams;
  const scenario = id ? getScenario(id) : undefined;

  if (!scenario) {
    return (
      <div className="game-card mx-auto max-w-md p-6 text-center">
        <h1 className="mb-2 text-base text-accent-800 pixel-title">
          Pick a Quest
        </h1>
        <p className="mb-4 text-sm text-slate-500">
          Choose a quest to start crafting your English.
        </p>
        <div className="flex flex-col gap-2">
          {SCENARIOS.slice(0, 3).map((s) => (
            <Link
              key={s.id}
              href={`/chat?scenario=${s.id}`}
              className="block-btn bg-accent-600 text-white"
            >
              {s.emoji} {s.title}
            </Link>
          ))}
          <Link href="/" className="mt-2 text-sm font-bold text-accent-600">
            ← Back to World
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <Link href="/" className="text-sm font-bold text-accent-600">
          ← Back to World
        </Link>
      </div>
      <ChatWindow scenario={scenario} />
    </div>
  );
}
