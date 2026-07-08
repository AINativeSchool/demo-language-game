# LINGOCRAFT

Craft your English! A **Minecraft/Roblox-style** language game for **school students**. Chat with characters, mine 💎 gems and XP, hop across a block-world map — and trade gems at the **Loot Shop** 🎮 (100 gems = 15 min screen time).

See [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) and [docs/DESIGN.md](docs/DESIGN.md) for the full spec.

## Features

- 🗺️ Hop across a block-world map as your skin unlocks new stages!
- 🤖 Chat with AI characters in real-life quests—get instant grammar and vocab boosts!
- 🎭 Toggle formal or casual mode—AI matches your vibe!
- 📦 Level up your lingo—stash epic words as loot in your Word Chest!
- 💎 Mine gems and XP for every quest win!
- 🦸 Pick, unlock, and flex awesome skins!
- 🕹️ Trade gems at the Loot Shop for real screen time (100 gems = 15 min)!
- 💾 Your adventure, your browser—no logins needed!

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
cp .env.example .env
```

Copy [`.env.example`](.env.example) to `.env` and set your provider key. LINGOCRAFT uses [resilient-llm](https://www.npmjs.com/package/resilient-llm) ([GitHub](https://github.com/gitcommitshow/resilient-llm)) — swap `PREFERRED_AI_SERVICE` / `PREFERRED_AI_MODEL` and the matching API key. Without a key, chat falls back to a built-in non-AI message.

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Production install and build (clean install from lockfile):

```bash
npm ci && npm run build
npm run start
```

Full VM setup (Nginx, systemd, HTTPS, updates): see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). A systemd unit is included at [`deploy/lingocraft.service`](deploy/lingocraft.service).

## Gamification constants

Coins-to-screen-time in [lib/constants.ts](lib/constants.ts):

- **100 coins = 15 minutes** of entertainment time.

## Project structure

- `app/` - pages (`/` map, `/chat`, `/vocabulary`, `/shop`) and `app/api/chat` route
- `components/` - UI building blocks (chat, world map, onboarding, etc.)
- `lib/` - [resilient-llm](https://www.npmjs.com/package/resilient-llm) wrapper (`lib/llm.ts`), localStorage store, scenarios, types, constants
