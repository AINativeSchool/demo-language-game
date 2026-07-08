// Central tunable constants for LingoQuest's gamification economy.

// Coins-to-screen-time convention: 100 coins = 15 minutes of entertainment.
export const REDEEM_RATE = { coins: 100, minutes: 15 } as const;

// Rewards granted for completing a conversation.
export const COINS_PER_CONVERSATION = 50;
export const XP_PER_CONVERSATION = 40;

// XP needed to advance one level (level also drives map progress).
export const XP_PER_LEVEL = 100;

// Convert a coin balance into the redeemable whole minutes it can buy.
export function coinsToMinutes(coins: number): number {
  return Math.floor(coins / REDEEM_RATE.coins) * REDEEM_RATE.minutes;
}
