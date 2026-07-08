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
        <h1 className="mb-2 text-xl font-extrabold text-accent-800">Pick a scenario</h1>
        <p className="mb-4 text-sm text-slate-500">
          Choose an adventure to start chatting.
        </p>
        <div className="flex flex-col gap-2">
          {SCENARIOS.slice(0, 3).map((s) => (
            <Link
              key={s.id}
              href={`/chat?scenario=${s.id}`}
              className="game-btn bg-accent-600 text-white shadow-[0_5px_0_0_var(--color-accent-700)]"
            >
              {s.emoji} {s.title}
            </Link>
          ))}
          <Link href="/" className="mt-2 text-sm font-bold text-accent-600">
            ← Back to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <Link href="/" className="text-sm font-bold text-accent-600">
          ← Back to Map
        </Link>
      </div>
      <ChatWindow scenario={scenario} />
    </div>
  );
}
