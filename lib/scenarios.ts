// Static game content: practice scenarios, the world-map journey, and avatars.

import type { Avatar, MapRegion, Scenario } from "./types";

// Conversation scenarios the learner can play. `minLevel` gates harder ones.
export const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "Order at a Cafe",
    emoji: "☕",
    description: "You walk into a cozy cafe and a friendly barista greets you.",
    goal: "Order a drink and a snack, and ask how much it costs.",
    minLevel: 1,
  },
  {
    id: "friend",
    title: "Meet a New Friend",
    emoji: "🙌",
    description: "You meet another student at the park who wants to hang out.",
    goal: "Introduce yourself and make plans to do something fun together.",
    minLevel: 1,
  },
  {
    id: "directions",
    title: "Ask for Directions",
    emoji: "🗺️",
    description: "You are a little lost in a new town and need help finding the library.",
    goal: "Politely ask for directions and understand the route.",
    minLevel: 2,
  },
  {
    id: "shopping",
    title: "Go Shopping",
    emoji: "🛍️",
    description: "You are at a shop looking for a birthday gift for a friend.",
    goal: "Ask about items, sizes, and prices, then decide what to buy.",
    minLevel: 3,
  },
  {
    id: "interview",
    title: "Club Interview",
    emoji: "🎤",
    description: "You are joining a school club and the leader asks you a few questions.",
    goal: "Talk about your hobbies and why you want to join the club.",
    minLevel: 4,
  },
];

// The journey: the avatar travels stop-by-stop toward an English-speaking country.
export const MAP_REGIONS: MapRegion[] = [
  { id: "home", name: "Home Village", emoji: "🏡" },
  { id: "harbor", name: "Harbor Town", emoji: "⚓" },
  { id: "airport", name: "Sky Airport", emoji: "✈️" },
  { id: "london", name: "London", emoji: "🎡" },
  { id: "newyork", name: "New York", emoji: "🗽" },
  { id: "sydney", name: "Sydney", emoji: "🌉" },
];

// Cosmetic avatars. The first is free and owned by default.
export const AVATARS: Avatar[] = [
  { id: "explorer", name: "Explorer", emoji: "🧑‍🚀", cost: 0 },
  { id: "fox", name: "Clever Fox", emoji: "🦊", cost: 150 },
  { id: "robot", name: "Bloco Bot", emoji: "🤖", cost: 250 },
  { id: "dragon", name: "Baby Dragon", emoji: "🐲", cost: 400 },
  { id: "wizard", name: "Word Wizard", emoji: "🧙", cost: 600 },
  { id: "alien", name: "Space Pal", emoji: "👽", cost: 800 },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getAvatar(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id);
}
