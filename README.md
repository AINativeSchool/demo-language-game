# LingoQuest

A game-like web app where school students practice real-time English conversations with an AI character. Learners choose a **formal** or **informal** register, earn **coins** and **XP**, advance an **avatar across a world map** toward an English-speaking country, and redeem coins for screen-time in the shop.

See [REQUIREMENTS.md](REQUIREMENTS.md) and [DESIGN.md](DESIGN.md) for the full spec.

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Browser `localStorage` as the primary store (no accounts, no database in v1)
- Server-only LLM access via [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) — wrapped in `lib/llm.ts` behind `app/api/chat`



## Getting started

1. Install dependencies:

```bash
npm install
```

1. Configure the LLM. Copy the example env file and add your provider key:

```bash
cp .env.example .env.local
```

Copy [`.env.example`](.env.example) and set your provider key. LingoQuest uses [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) — swap `PREFERRED_AI_SERVICE` / `PREFERRED_AI_MODEL` and the matching API key. Without a key, chat falls back to a built-in non-AI message.

1. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gamification constants

Coins-to-screen-time is a fixed, editable convention in [lib/constants.ts](lib/constants.ts):

- **100 coins = 15 minutes** of entertainment time.



## Project structure

- `app/` - pages (`/` map, `/chat`, `/vocabulary`, `/shop`) and `app/api/chat` route
- `components/` - UI building blocks (chat, world map, register toggle, etc.)
- `lib/` - [resilient-llm](https://www.npmjs.com/package/resilient-llm) wrapper (`lib/llm.ts`), localStorage store, scenarios, types, constants

