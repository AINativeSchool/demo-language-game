// Chat API route: validates the incoming conversation request and delegates to
// lib/llm.ts (resilient-llm — https://www.npmjs.com/package/resilient-llm). The
// client's fallback guarantees a 200 response even when the provider is
// misconfigured or unavailable.

import { NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import type { ChatMessage, Register } from "@/lib/types";

interface ChatRequestBody {
  messages?: ChatMessage[];
  register?: Register;
  scenario?: { title?: string; description?: string; goal?: string };
}

const VALID_ROLES = new Set(["system", "user", "assistant"]);

// Runs on the Node.js runtime so server-only env vars stay off the client.
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages, register, scenario } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "`messages` must be a non-empty array." },
      { status: 400 },
    );
  }

  const messagesValid = messages.every(
    (m) =>
      m &&
      typeof m.content === "string" &&
      typeof m.role === "string" &&
      VALID_ROLES.has(m.role),
  );
  if (!messagesValid) {
    return NextResponse.json(
      { error: "Each message needs a valid `role` and string `content`." },
      { status: 400 },
    );
  }

  if (register !== "formal" && register !== "informal") {
    return NextResponse.json(
      { error: "`register` must be 'formal' or 'informal'." },
      { status: 400 },
    );
  }

  if (!scenario || typeof scenario.title !== "string") {
    return NextResponse.json(
      { error: "`scenario` with a title is required." },
      { status: 400 },
    );
  }

  const result = await chat({
    messages,
    register,
    scenario: {
      title: scenario.title,
      description: scenario.description ?? "",
      goal: scenario.goal ?? "",
    },
  });

  return NextResponse.json(result);
}
