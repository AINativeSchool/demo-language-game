"use client";

// React hooks that subscribe to the localStorage store and re-render on change.

import { useEffect, useState } from "react";
import { STORE_EVENT, getProfile, getVocabulary } from "./store";
import type { Profile, StoredVocab } from "./types";

// Subscribe to profile changes (coins, xp, level, avatar, map progress).
export function useProfile(): Profile | null {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const sync = () => setProfile(getProfile());
    sync();
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return profile;
}

// Subscribe to the saved vocabulary list.
export function useVocabulary(): StoredVocab[] {
  const [vocab, setVocab] = useState<StoredVocab[]>([]);

  useEffect(() => {
    const sync = () => setVocab(getVocabulary());
    sync();
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return vocab;
}
