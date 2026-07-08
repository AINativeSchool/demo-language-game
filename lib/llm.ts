// Resilient LLM client for LINGOCRAFT.
//
// Delegates provider calls to resilient-llm (https://www.npmjs.com/package/resilient-llm,
// https://github.com/gitcommitshow/resilient-llm) and maps structured JSON into the
// app's LlmResult shape. Falls back gracefully when the provider is unavailable.

import { ProviderRegistry, ResilientLLM } from "resilient-llm";
import type { ChatMessage as ResilientChatMessage } from "resilient-llm";
import type { ChatMessage, LlmResult, Register, Scenario } from "./types";

const TIMEOUT_MS = 20_000;
const DEFAULT_SERVICE = "openai";
const DEFAULT_MODEL = "gpt-5.4-nano";
const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF = 2;
const DEFAULT_RATE_LIMIT_RPM = 30;
const DEFAULT_RATE_LIMIT_TPM = 60000;

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
    "You are a friendly AI character in LINGOCRAFT, a Minecraft/Roblox-style language game for school-aged students learning English.",
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

// Map resilient-llm structured output into the app's LlmResult contract.
function normalizeResult(content: string | Record<string, unknown> | null): LlmResult {
  let parsed: Partial<LlmResult>;

  if (typeof content === "string") {
    try {
      const cleaned = content
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned) as Partial<LlmResult>;
    } catch {
      return { reply: content, corrections: [], newWords: [] };
    }
  } else if (content && typeof content === "object") {
    parsed = content as Partial<LlmResult>;
  } else {
    return { reply: "", corrections: [], newWords: [] };
  }

  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : "",
    corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
    newWords: Array.isArray(parsed.newWords) ? parsed.newWords : [],
  };
}

// Resolve the active provider and model from resilient-llm env conventions.
function resolveServiceAndModel(): { aiService: string; model: string } {
  return {
    aiService: process.env.PREFERRED_AI_SERVICE ?? DEFAULT_SERVICE,
    model: process.env.PREFERRED_AI_MODEL ?? DEFAULT_MODEL,
  };
}

// Return true when resilient-llm can authenticate the chosen provider.
function hasProviderApiKey(aiService: string): boolean {
  return ProviderRegistry.hasApiKey(aiService);
}

let openAiProviderConfigured = false;

// Apply OPENAI_BASE_URL once so resilient-llm routes to a compatible endpoint.
function ensureOpenAiProvider(): void {
  if (openAiProviderConfigured) return;

  const baseUrl = process.env.OPENAI_BASE_URL;
  if (baseUrl) {
    ProviderRegistry.configure("openai", {
      baseUrl: baseUrl.replace(/\/+$/, ""),
    });
  }

  openAiProviderConfigured = true;
}

// Parse a numeric env var, falling back when unset or invalid.
function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

// Build resilient-llm client options from env (generation caps read by resilient-llm itself).
function buildLlmOptions(aiService: string, model: string) {
  return {
    aiService,
    model,
    timeout: envInt("LLM_TIMEOUT", TIMEOUT_MS),
    retries: envInt("LLM_RETRIES", DEFAULT_RETRIES),
    backoffFactor: envInt("LLM_BACKOFF_FACTOR", DEFAULT_BACKOFF),
    rateLimitConfig: {
      requestsPerMinute: envInt("RATE_LIMIT_RPM", DEFAULT_RATE_LIMIT_RPM),
      llmTokensPerMinute: envInt("RATE_LIMIT_TPM", DEFAULT_RATE_LIMIT_TPM),
    },
  };
}

// Build a resilient-llm client from server env vars; null when unconfigured.
function createLlmClient(): ResilientLLM | null {
  const { aiService, model } = resolveServiceAndModel();
  if (!hasProviderApiKey(aiService)) return null;

  if (aiService === "openai") ensureOpenAiProvider();

  return new ResilientLLM(buildLlmOptions(aiService, model));
}

// Public entry point: run a conversation turn and return structured results.
export async function chat(options: ChatOptions): Promise<LlmResult> {
  const llm = createLlmClient();
  if (!llm) return fallbackResult();

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(options.register, options.scenario) },
    ...options.messages,
  ];

  try {
    const { content } = await llm.chat(messages as ResilientChatMessage[], {
      responseFormat: { type: "json_object" },
    });
    return normalizeResult(content);
  } catch (err) {
    console.error("LLM chat failed, using fallback:", err);
    return fallbackResult();
  }
}
