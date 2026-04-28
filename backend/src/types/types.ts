// ─── City ─────────────────────────────────────────────────────────────────────
export interface City {
  cityId: number;
  cityName: string;
  latitude: number;
  longitude: number;
  cityImage: string | null;
}

// ─── Location ─────────────────────────────────────────────────────────────────
export interface Location {
  locationId: number;
  cityId: number;
  locationName: string;
  locationDescription: string | null;
  locationImage: string | null;
  latitude: number;
  longitude: number;
}

// ─── Quest ───────────────────────────────────────────────────────────────────
export interface Quest {
  questId: number;
  cityId: number;
  questName: string;
  questShortDescription: string | null;
  questIntroImage: string | null;
}

export interface QuestWithCity extends Quest {
  cityName: string;
  latitude: number;
  longitude: number;
}

// ─── Clue ────────────────────────────────────────────────────────────────────
export interface Clue {
  clueId: number;
  questId: number;
  locationId: number;
  clueDescription: string | null;
  clueOrder: number;
}

// Joined result returned to the mobile-app for /clues/quest/:questId
export interface ClueWithDetails extends Clue {
  locationName: string;
  locationDescription: string | null;
  locationImage: string | null;
  latitude: number;
  longitude: number;
  puzzleId: number | null;
  puzzleName: string | null;
  puzzleDescription: string | null;
  puzzleAnswer: string | null;
}

// ─── Puzzle ──────────────────────────────────────────────────────────────────
export interface Puzzle {
  puzzleId: number;
  clueId: number;
  puzzleName: string | null;
  puzzleDescription: string | null;
  puzzleAnswer: string | null;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  authProvider: AuthProvider;
  authProviderUserId: string;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
}

export type AuthProvider = "email" | "google" | "apple";

// ─── UserProgress ────────────────────────────────────────────────────────────
export interface UserProgress {
  progressId: number;
  userId: number;
  questId: number;
  clueId: number;
  completedAt: string;
}

// ─── Reward ──────────────────────────────────────────────────────────────────
export interface Reward {
  rewardId: number;
  userId: number;
  questId: number;
  rewardName: string;
  awardedAt: string;
}
