# LingoQuest — Design

Technical design for the LingoQuest MVP described in [REQUIREMENTS.md](REQUIREMENTS.md). A game-like web app for school students — practice English with AI, earn coins for the Screen-Time Shop, and advance an avatar across a world map.

## 1. Tech Stack
- **Framework:** Next.js (App Router) + TypeScript — one Node.js app serving both UI and API routes.
- **Styling:** Tailwind CSS (playful, Roblox/Minecraft-inspired visuals).
- **Storage:** Browser `localStorage` as the primary store (no database, no accounts in v1).
- **LLM access:** Server-side only, via a Next.js API route that wraps [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) in `lib/llm.ts`. The browser never sees the API key.

## 2. High-Level Architecture

```mermaid
flowchart LR
  UI[Next.js Client UI] -->|POST messages, register, scenario| API["/api/chat route"]
  API --> LLM["lib/llm.ts (resilient-llm)"]
  LLM -->|retry, timeout, fallback| Provider[LLM provider API]
  UI <-->|read/write progress, vocab| LS[localStorage store]
```

- The client sends conversation messages plus the chosen register (formal/informal) and scenario to `/api/chat`.
- The API route calls `lib/llm.ts`, which delegates to [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) and returns a single structured JSON payload: the assistant reply, gentle corrections, and any new vocabulary.
- The UI renders the reply and feedback, auto-saves new words, and updates coins/XP/map progress in `localStorage`.

## 3. Configuration
Copy [`.env.example`](../.env.example) to `.env.local`. Provider and model are set via `PREFERRED_AI_SERVICE` and `PREFERRED_AI_MODEL`; see [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) for all supported providers and env vars.

App constant:
- `COINS_PER_MINUTE` — coins-to-screen-time convention. Default: **100 coins = 15 min** (editable).

## 4. Data Model (localStorage)
Accessed through a typed, SSR-safe store module (`lib/store.ts`).

- **`profile`**: `{ avatarId, coins, xp, level, mapProgress }`
- **`vocabulary`**: `[{ word, meaning, example, addedAt }]`

`mapProgress` is the index of the furthest unlocked region; XP thresholds unlock the next region.

## 5. Resilient LLM Client (`lib/llm.ts`)
Purpose: a single, dependable entry point for all LLM calls so the UI never breaks.

- **Provider layer:** [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) handles retries, exponential backoff, circuit breaking, and rate limiting.
- **Timeout:** 20 s per request via resilient-llm's `timeout` option (overridable with `LLM_TIMEOUT`).
- **Fallback:** returns a graceful, in-character message if all attempts fail or no API key is set.
- **Prompting:** builds the system prompt from the selected register (formal vs. informal) and the active scenario, and constrains tone/topic to be school-appropriate.
- **Structured output:** requests JSON of the form `{ reply, corrections[], newWords[] }` via `responseFormat: { type: "json_object" }`.

## 6. Screens & Routes
| Route | Screen | Responsibility |
| --- | --- | --- |
| `/` | Home / Map | World-map avatar journey, coin balance, avatar, scenario picker |
| `/chat` | Conversation | Chat UI, formal/informal toggle, live feedback panel, coin/XP reward on completion |
| `/vocabulary` | Vocabulary | Saved words with meaning and example |
| `/shop` | Screen-Time Shop | Redeem coins for screen-time; buy avatars |

Supporting components: `ChatWindow`, `RegisterToggle`, `FeedbackPanel`, `WorldMap`, `CoinBadge`, `AvatarPicker`, `OnboardingTour`, `SchoolBadge`.

## 7. Gamification Model
- Coins and XP are awarded per completed conversation.
- XP drives level, and levels unlock new map regions (avatar travels toward the country where the language is spoken).
- Coins redeem for screen-time at the Screen-Time Shop (`REDEEM_RATE`: 100 coins = 15 min) or buy avatars.

## 8. Design Decisions (resolved open questions)
- **Coins → time:** fixed convention (100 coins = 15 min), exposed as an editable constant.
- **Provider:** [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) — swap providers via `PREFERRED_AI_SERVICE` / `PREFERRED_AI_MODEL` without code changes.
- **Kid-safety:** enforced in v1 through the system prompt (school-appropriate topic/tone); real content moderation is a noted follow-up.

## 9. Out of Scope (v1)
Accounts, teacher/class dashboards, multiplayer, voice/speech, native mobile app, and real (enforced) screen-time control.
