# LingoQuest Requirements

A gamified language-learning web app for school students. Learners practice **real-time text conversations** with AI characters to build fluency and vocabulary, choosing a **formal or informal** register. Designed to feel more like a game (Roblox/Minecraft energy) than a flashcard app.

## 1. Goal & Audience

- **Audience:** School students (kids/teens).
- **Objective:** Improve English fluency and expand vocabulary through conversation practice.
- **Differentiator:** More creative and game-like than Duolingo — story, exploration, and rewards over drills.

## 2. Scope (v1 / MVP)

- **Platform:** Web app.
- **Users:** Single learner, no login/accounts yet (local progress).
- **Language:** English practice (fluency + vocabulary building).



## 3. Core Features



### 3.1 Real-Time Conversation Practice

- Text chat with an **LLM-powered AI character**.
- **Register toggle:** learner chooses **Formal** or **Informal** before/within a conversation; the AI adapts tone accordingly.
- Scenario-based dialogues (e.g., ordering food, meeting a friend, asking directions).
- In-context feedback: gentle correction of grammar/word choice and suggestions to expand vocabulary.
- Vocabulary capture: new/notable words surfaced and saved during chats.



### 3.2 Gamification & Rewards

- **Coins** earned by completing conversations/quests; coins convert into **allowed entertainment/screen time**.
- **Avatars & animated characters** the learner can pick and unlock.
- **World map journey:** learner's avatar travels toward/through the country where the language is spoken, unlocking new regions as they progress.
- Game-inspired feel (Roblox/Minecraft): playful visuals, exploration, unlockables.
- Progression: levels/XP tied to map advancement and conversation milestones.



### 3.3 Learner Progress

- Track completed scenarios, coins earned, words learned, and map progress.
- Persist progress locally (per browser) for MVP.



## 4. Non-Goals (v1)

- No user accounts, teacher/class dashboards, or multiplayer.
- No voice/speech (text only for MVP).
- No mobile-native app.
- No real-money or external screen-time enforcement (coins→time is in-app/agreed convention).



## 5. Key Screens

1. **Home / Map** — world journey, current location, coin balance, avatar.
2. **Conversation** — chat UI with AI character + formal/informal toggle + live feedback panel.
3. **Vocabulary** — saved words with meaning/example.
4. **Rewards/Shop** — spend coins on avatars/characters and screen-time.



## 6. Open Questions

- Exact coin → entertainment-time conversion and who sets it (student vs. parent).
- Which LLM/provider powers conversations (cost, latency, safety filtering for kids).: Use resilient-llm library with which we will be able to change the LLM.
- Content safety & moderation approach for a kids' audience.
- Difficulty scaling: how AI adjusts to learner level over time.



## 7. Success Criteria

- A learner can hold a coherent formal or informal conversation, receive helpful corrections, earn coins, and see their avatar advance on the map — all in one session.

