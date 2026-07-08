// Shared domain types used across the client UI, store, and LLM layer.

export type Register = "formal" | "informal";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// A gentle correction the AI offers on the learner's message.
export interface Correction {
  original: string;
  suggestion: string;
  note: string;
}

// A vocabulary item surfaced during a conversation.
export interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

// A vocabulary item as persisted in localStorage.
export interface StoredVocab extends VocabWord {
  addedAt: number;
}

// The structured payload returned by lib/llm.ts (resilient-llm wrapper).
export interface LlmResult {
  reply: string;
  corrections: Correction[];
  newWords: VocabWord[];
  fallback?: boolean;
}

// A practice scenario the learner can play through.
export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  goal: string;
  minLevel: number;
}

// A stop on the world-map journey toward an English-speaking country.
export interface MapRegion {
  id: string;
  name: string;
  emoji: string;
  /** Atmospheric city/place photo used as the map pin background. */
  imageUrl: string;
  /** Short flavor line shown on the active stop. */
  blurb: string;
}

// A cosmetic avatar the learner can own / unlock in the shop.
export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}

// The learner's persisted progress.
export interface Profile {
  avatarId: string;
  ownedAvatars: string[];
  coins: number;
  xp: number;
  level: number;
  mapProgress: number;
  redeemedMinutes: number;
}
