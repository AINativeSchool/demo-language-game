"use client";

// The core conversation experience: renders the chat, sends turns to the API,
// surfaces coaching feedback, auto-saves vocabulary, and grants rewards when
// the learner finishes the scenario.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RegisterToggle from "./RegisterToggle";
import FeedbackPanel from "./FeedbackPanel";
import { COINS_PER_CONVERSATION, XP_PER_CONVERSATION } from "@/lib/constants";
import { addVocabulary, awardConversationRewards } from "@/lib/store";
import type {
  ChatMessage,
  Correction,
  LlmResult,
  Register,
  Scenario,
  VocabWord,
} from "@/lib/types";

interface ChatWindowProps {
  scenario: Scenario;
}

const MIN_LEARNER_TURNS = 3; // Turns needed before the conversation can be completed.

export default function ChatWindow({ scenario }: ChatWindowProps) {
  const [register, setRegister] = useState<Register>("informal");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [newWords, setNewWords] = useState<VocabWord[]>([]);
  const [finished, setFinished] = useState(false);
  const [reward, setReward] = useState<{ coins: number; xp: number } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const learnerTurns = messages.filter((m) => m.role === "user").length;
  const canFinish = learnerTurns >= MIN_LEARNER_TURNS && !finished;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading || finished) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          register,
          scenario: {
            title: scenario.title,
            description: scenario.description,
            goal: scenario.goal,
          },
        }),
      });
      const data = (await res.json()) as LlmResult;

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.corrections?.length) setCorrections(data.corrections);
      if (data.newWords?.length) {
        setNewWords(data.newWords);
        addVocabulary(data.newWords);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hmm, I couldn't hear you there. Could you try again?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function finish() {
    if (!canFinish) return;
    awardConversationRewards(COINS_PER_CONVERSATION, XP_PER_CONVERSATION);
    setReward({ coins: COINS_PER_CONVERSATION, xp: XP_PER_CONVERSATION });
    setFinished(true);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="game-card flex h-[70vh] flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 p-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              {scenario.emoji}
            </span>
            <div>
              <p className="font-extrabold leading-tight text-brand-700">{scenario.title}</p>
              <p className="text-xs text-slate-500">{scenario.goal}</p>
            </div>
          </div>
          <RegisterToggle value={register} onChange={setRegister} />
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
            {scenario.description} Say hello to get started!
          </div>

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-brand-500 text-white shadow-[0_3px_0_0_var(--color-brand-700)]"
                    : "bg-white text-slate-800 shadow"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-3.5 py-2 text-sm text-slate-400 shadow">
                typing…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/70 p-3">
          {finished ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2">
              <p className="text-sm font-bold text-emerald-700">
                🎉 Great chat! +{reward?.coins} coins, +{reward?.xp} XP
              </p>
              <Link
                href="/"
                className="game-btn bg-grass-500 text-white shadow-[0_5px_0_0_#2b8a45]"
              >
                Back to Map
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your reply…"
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="game-btn bg-brand-500 text-white shadow-[0_5px_0_0_var(--color-brand-700)]"
              >
                Send
              </button>
              <button
                type="button"
                onClick={finish}
                disabled={!canFinish}
                title={
                  canFinish
                    ? "Finish and collect your reward"
                    : `Chat a bit more (${learnerTurns}/${MIN_LEARNER_TURNS})`
                }
                className="game-btn bg-coin text-[#5b4300] shadow-[0_5px_0_0_var(--color-coin-dark)]"
              >
                Finish
              </button>
            </div>
          )}
        </div>
      </div>

      <FeedbackPanel corrections={corrections} newWords={newWords} />
    </div>
  );
}
