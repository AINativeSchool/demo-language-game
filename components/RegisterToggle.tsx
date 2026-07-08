"use client";

// Lets the learner switch between formal and informal conversation register.

import type { Register } from "@/lib/types";

interface RegisterToggleProps {
  value: Register;
  onChange: (value: Register) => void;
}

const OPTIONS: { value: Register; label: string; emoji: string }[] = [
  { value: "informal", label: "Casual", emoji: "😎" },
  { value: "formal", label: "Formal", emoji: "🎩" },
];

export default function RegisterToggle({ value, onChange }: RegisterToggleProps) {
  return (
    <div
      className="inline-flex rounded-2xl bg-brand-100 p-1"
      role="group"
      aria-label="Conversation style"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-xl px-3 py-1.5 text-sm font-extrabold transition ${
              active
                ? "bg-white text-brand-700 shadow"
                : "text-brand-700/70 hover:text-brand-700"
            }`}
          >
            <span className="mr-1" aria-hidden>
              {opt.emoji}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
