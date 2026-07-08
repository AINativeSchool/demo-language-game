// SSR-safe localStorage store for LINGOCRAFT progress.
//
// This is the app's primary storage (no backend DB). All writes dispatch a
// window event so any mounted component (e.g. the coin badge) can refresh.

import {
  XP_PER_LEVEL,
  coinsToMinutes,
} from "./constants";
import { AVATARS, MAP_REGIONS } from "./scenarios";
import type { Profile, StoredVocab, VocabWord } from "./types";

const PROFILE_KEY = "lingoquest.profile";
const VOCAB_KEY = "lingoquest.vocab";
export const STORE_EVENT = "lingoquest:store-updated";

const DEFAULT_PROFILE: Profile = {
  avatarId: "explorer",
  ownedAvatars: ["explorer"],
  coins: 0,
  xp: 0,
  level: 1,
  mapProgress: 0,
  redeemedMinutes: 0,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Notify subscribers (UI) that stored data changed.
function emitChange(): void {
  if (isBrowser()) {
    window.dispatchEvent(new Event(STORE_EVENT));
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...(JSON.parse(raw) as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}

// ---- Profile ----

export function getProfile(): Profile {
  return readJson<Profile>(PROFILE_KEY, DEFAULT_PROFILE);
}

export function saveProfile(profile: Profile): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  emitChange();
}

// Derive level and map progress from total XP, then persist rewards.
export function awardConversationRewards(coins: number, xp: number): Profile {
  const current = getProfile();
  const totalXp = current.xp + xp;
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const mapProgress = Math.min(level - 1, MAP_REGIONS.length - 1);

  const updated: Profile = {
    ...current,
    coins: current.coins + coins,
    xp: totalXp,
    level,
    mapProgress,
  };
  saveProfile(updated);
  return updated;
}

// Attempt to buy an avatar; returns whether the purchase succeeded.
export function buyAvatar(avatarId: string): boolean {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  if (!avatar) return false;

  const current = getProfile();
  if (current.ownedAvatars.includes(avatarId)) return true;
  if (current.coins < avatar.cost) return false;

  saveProfile({
    ...current,
    coins: current.coins - avatar.cost,
    ownedAvatars: [...current.ownedAvatars, avatarId],
    avatarId,
  });
  return true;
}

// Equip an already-owned avatar.
export function equipAvatar(avatarId: string): void {
  const current = getProfile();
  if (!current.ownedAvatars.includes(avatarId)) return;
  saveProfile({ ...current, avatarId });
}

// Redeem coins for entertainment minutes. Returns minutes added, or 0.
export function redeemCoins(coins: number): number {
  const current = getProfile();
  const minutes = coinsToMinutes(coins);
  if (minutes <= 0 || coins > current.coins) return 0;

  saveProfile({
    ...current,
    coins: current.coins - coins,
    redeemedMinutes: current.redeemedMinutes + minutes,
  });
  return minutes;
}

// ---- Vocabulary ----

export function getVocabulary(): StoredVocab[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(VOCAB_KEY);
    return raw ? (JSON.parse(raw) as StoredVocab[]) : [];
  } catch {
    return [];
  }
}

// Add new words, skipping duplicates (case-insensitive).
export function addVocabulary(words: VocabWord[]): void {
  if (!isBrowser() || words.length === 0) return;
  const existing = getVocabulary();
  const known = new Set(existing.map((w) => w.word.toLowerCase()));

  const additions: StoredVocab[] = words
    .filter((w) => w.word && !known.has(w.word.toLowerCase()))
    .map((w) => ({ ...w, addedAt: Date.now() }));

  if (additions.length === 0) return;
  window.localStorage.setItem(
    VOCAB_KEY,
    JSON.stringify([...additions, ...existing]),
  );
  emitChange();
}
