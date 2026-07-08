# LingoQuest

A game-like web app where school students practice real-time English conversations with an AI character. Learners choose a **formal** or **informal** register, earn **coins** and **XP**, advance an **avatar across a world map** toward an English-speaking country, and redeem coins for screen-time in the shop.

See [REQUIREMENTS.md](REQUIREMENTS.md) and [DESIGN.md](DESIGN.md) for the full spec.

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Browser `localStorage` as the primary store (no accounts, no database in v1)
- Server-only LLM access through a resilient client (`lib/llm.ts`) behind `app/api/chat`



## Getting started

1. Install dependencies:

```bash
npm install
```

1. Configure the LLM. Copy the example env file and add your key:

```bash
cp .env.example .env.local
```

The client uses the standard OpenAI environment variables:


| Variable          | Required | Default                     | Purpose                               |
| ----------------- | -------- | --------------------------- | ------------------------------------- |
| `OPENAI_API_KEY`  | Yes      | -                           | OpenAI API key (server-side only)     |
| `OPENAI_BASE_URL` | No       | `https://api.openai.com/v1` | OpenAI-compatible base URL            |
| `OPENAI_MODEL`    | No       | `gpt-5.4-nano`              | Model name (latest low-cost GPT nano) |


> Only `OPENAI_API_KEY` is required; base URL and model default automatically. Without a key, conversations still work using a built-in graceful fallback, but replies won't be AI-generated.

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
- `lib/` - [Resilient LLM](https://github.com/gitcommitshow/resilient-llm) client, localStorage store, scenarios, types, constants

