# LingoQuest

English practice for **school students**. Chat with AI, earn coins and XP, travel a world map — and redeem coins at the **Screen-Time Shop** 🎮 (100 coins = 15 min).

See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) and [docs/DESIGN.md](docs/DESIGN.md) for the full spec.

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

2. Configure the LLM. Copy the example env file and add your provider key:

```bash
cp .env.example .env.local
```

Copy [`.env.example`](.env.example) and set your provider key. LingoQuest uses [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) — swap `PREFERRED_AI_SERVICE` / `PREFERRED_AI_MODEL` and the matching API key. Without a key, chat falls back to a built-in non-AI message.

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gamification constants

Coins-to-screen-time in [lib/constants.ts](lib/constants.ts):

- **100 coins = 15 minutes** of entertainment time.

## Project structure

- `app/` - pages (`/` map, `/chat`, `/vocabulary`, `/shop`) and `app/api/chat` route
- `components/` - UI building blocks (chat, world map, onboarding, etc.)
- `lib/` - [resilient-llm](https://www.npmjs.com/package/resilient-llm) wrapper (`lib/llm.ts`), localStorage store, scenarios, types, constants
