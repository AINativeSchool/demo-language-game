// Resilient LLM client for LingoQuest.
//
// Wraps an OpenAI-compatible chat completions API with a request timeout,
// exponential-backoff retries on transient errors (429/5xx/network), and a
// graceful in-character fallback so the conversation UI never breaks even when
// the provider is unavailable or unconfigured.

import type { ChatMessage, LlmResult, Register, Scenario } from "./types";

const TIMEOUT_MS = 20_000;
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;

// Standard OpenAI-compatible defaults; overridable via environment variables.
const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-5.4-nano";

interface ChatOptions {
  messages: ChatMessage[];
  register: Register;
  scenario: Pick<Scenario, "title" | "description" | "goal">;
}

// Compose the system prompt from the chosen register and active scenario.
function buildSystemPrompt(register: Register, scenario: ChatOptions["scenario"]): string {
  const tone =
    register === "formal"
      ? "Speak in polite, formal English (full sentences, courteous phrasing, no slang)."
      : "Speak in relaxed, informal English (friendly, casual, everyday expressions and contractions).";

  return [
    "You are a friendly AI character in LingoQuest, a language game for school-aged students learning English.",
    "Keep every message safe, encouraging, and appropriate for children. Avoid any mature, violent, or unsafe topics.",
    `Scenario: ${scenario.title}. ${scenario.description} Goal: ${scenario.goal}`,
    tone,
    "Stay in character and keep replies short (1-3 sentences) so it feels like a real chat.",
    "Gently help the learner improve: when they make a mistake, offer a correction with a brief, kind note.",
    "Introduce or highlight up to 2 useful vocabulary words when natural.",
    "",
    "Respond ONLY with a JSON object (no markdown, no code fences) matching exactly:",
    "{",
    '  "reply": string,',
    '  "corrections": [{ "original": string, "suggestion": string, "note": string }],',
    '  "newWords": [{ "word": string, "meaning": string, "example": string }]',
    "}",
    "Use empty arrays when there are no corrections or new words.",
  ].join("\n");
}

// Sleep helper for backoff.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A safe, encouraging response used when the provider cannot be reached.
function fallbackResult(): LlmResult {
  return {
    reply:
      "Oops, my walkie-talkie is a bit fuzzy right now! Let's keep practicing - tell me a little more and I'll do my best.",
    corrections: [],
    newWords: [],
    fallback: true,
  };
}

// Pull the model's JSON content out of a chat-completions response and parse it.
function parseCompletion(json: unknown): LlmResult {
  const content =
    (json as { choices?: { message?: { content?: string } }[] })?.choices?.[0]
      ?.message?.content ?? "";

  // Strip accidental code fences before parsing.
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<LlmResult>;
  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : "",
    corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
    newWords: Array.isArray(parsed.newWords) ? parsed.newWords : [],
  };
}

// Determine whether a failed attempt is worth retrying.
function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

// Single provider call guarded by an AbortController timeout.
async function callProvider(
  url: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// Public entry point: run a conversation turn and return structured results.
export async function chat(options: ChatOptions): Promise<LlmResult> {
  // Read the standard OpenAI env vars; base URL and model fall back to sane
  // defaults so only OPENAI_API_KEY is strictly required.
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  // Without an API key we cannot call a provider; degrade gracefully.
  if (!apiKey) {
    return fallbackResult();
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(options.register, options.scenario) },
    ...options.messages,
  ];

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await callProvider(url, apiKey, model, messages);

      if (res.ok) {
        return parseCompletion(await res.json());
      }

      if (isRetryableStatus(res.status) && attempt < MAX_RETRIES) {
        await delay(BASE_BACKOFF_MS * 2 ** attempt);
        continue;
      }

      // Non-retryable HTTP error (e.g. 400/401): stop and fall back.
      lastError = new Error(`Provider responded ${res.status}`);
      break;
    } catch (err) {
      // Network errors, timeouts, or JSON parse failures.
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await delay(BASE_BACKOFF_MS * 2 ** attempt);
        continue;
      }
    }
  }

  console.error("LLM chat failed, using fallback:", lastError);
  return fallbackResult();
}
