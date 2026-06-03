import { database } from "../../database.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { authConfig } from "../config/auth.ts";
import type { Puzzle } from "../types/types.ts";

export const getPuzzles = async (): Promise<Puzzle[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT puzzleId, clueId, puzzleName, puzzleDescription FROM puzzles",
  );
  return rows as Puzzle[];
};

export const getPuzzleById = async (
  puzzleId: number,
): Promise<Puzzle | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT puzzleId, clueId, puzzleName, puzzleDescription FROM puzzles WHERE puzzleId = ?",
    [puzzleId],
  );
  return rows.length > 0 ? (rows[0] as Puzzle) : null;
};

export const getPuzzlesByClueId = async (clueId: number): Promise<Puzzle[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT puzzleId, clueId, puzzleName, puzzleDescription FROM puzzles WHERE clueId = ?",
    [clueId],
  );
  return rows as Puzzle[];
};

interface PuzzleSolveRow extends RowDataPacket {
  puzzleId: number;
  puzzleAnswer: string | null;
  clueId: number;
  clueOrder: number;
  questId: number;
  latitude: number;
  longitude: number;
}

const normalizeAnswer = (value: string) => value.trim().toLowerCase();

const getDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const radiusMeters = 6371000;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return radiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const awardQuestIfComplete = async (
  userId: number,
  questId: number,
): Promise<void> => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT
      (SELECT COUNT(*) FROM clues WHERE questId = ?) AS totalClues,
      (SELECT COUNT(DISTINCT clueId) FROM userProgress WHERE userId = ? AND questId = ?) AS completedClues`,
    [questId, userId, questId],
  );
  const totalClues = Number(rows[0]?.totalClues ?? 0);
  const completedClues = Number(rows[0]?.completedClues ?? 0);

  if (totalClues > 0 && completedClues >= totalClues) {
    await database.query<ResultSetHeader>(
      "INSERT IGNORE INTO rewards (userId, questId, rewardName) VALUES (?, ?, ?)",
      [userId, questId, "Quest completed"],
    );
  }
};

export const solvePuzzle = async (input: {
  userId: number;
  puzzleId: number;
  answer: string;
  latitude?: number;
  longitude?: number;
}): Promise<{ solved: boolean; progressId: number | null; questComplete: boolean }> => {
  const [rows] = await database.query<PuzzleSolveRow[]>(
    `SELECT
      puzzles.puzzleId,
      puzzles.puzzleAnswer,
      clues.clueId,
      clues.clueOrder,
      clues.questId,
      locations.latitude,
      locations.longitude
    FROM puzzles
    JOIN clues ON clues.clueId = puzzles.clueId
    JOIN locations ON locations.locationId = clues.locationId
    WHERE puzzles.puzzleId = ?
    LIMIT 1`,
    [input.puzzleId],
  );
  const puzzle = rows[0];
  if (!puzzle) {
    throw new Error("Puzzle not found");
  }

  const expectedAnswer = normalizeAnswer(puzzle.puzzleAnswer ?? "");
  if (!expectedAnswer || normalizeAnswer(input.answer) !== expectedAnswer) {
    return { solved: false, progressId: null, questComplete: false };
  }

  const hasLocation =
    Number.isFinite(input.latitude) && Number.isFinite(input.longitude);
  if (!authConfig.allowDevQuestSolve && !hasLocation) {
    throw new Error("Location is required");
  }
  if (
    !authConfig.allowDevQuestSolve &&
    getDistanceMeters(
      Number(input.latitude),
      Number(input.longitude),
      Number(puzzle.latitude),
      Number(puzzle.longitude),
    ) > 30
  ) {
    throw new Error("Not close enough to solve this puzzle");
  }

  const [progressRows] = await database.query<RowDataPacket[]>(
    "SELECT clueId FROM userProgress WHERE userId = ? AND questId = ?",
    [input.userId, puzzle.questId],
  );
  const completedClueIds = new Set(
    progressRows.map((row) => Number(row.clueId)),
  );
  if (completedClueIds.has(puzzle.clueId)) {
    await awardQuestIfComplete(input.userId, puzzle.questId);
    const [completionRows] = await database.query<RowDataPacket[]>(
      `SELECT
        (SELECT COUNT(*) FROM clues WHERE questId = ?) AS totalClues,
        (SELECT COUNT(DISTINCT clueId) FROM userProgress WHERE userId = ? AND questId = ?) AS completedClues`,
      [puzzle.questId, input.userId, puzzle.questId],
    );
    return {
      solved: true,
      progressId: null,
      questComplete:
        Number(completionRows[0]?.totalClues ?? 0) > 0 &&
        Number(completionRows[0]?.completedClues ?? 0) >=
          Number(completionRows[0]?.totalClues ?? 0),
    };
  }

  const [previousRows] = await database.query<RowDataPacket[]>(
    "SELECT clueId FROM clues WHERE questId = ? AND clueOrder < ?",
    [puzzle.questId, puzzle.clueOrder],
  );
  const hasSolvedPrevious = previousRows.every((row) =>
    completedClueIds.has(Number(row.clueId)),
  );
  if (!hasSolvedPrevious) {
    throw new Error("Previous clues must be solved first");
  }

  const [result] = await database.query<ResultSetHeader>(
    "INSERT INTO userProgress (userId, questId, clueId) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE completedAt = completedAt",
    [input.userId, puzzle.questId, puzzle.clueId],
  );
  await awardQuestIfComplete(input.userId, puzzle.questId);

  const [completionRows] = await database.query<RowDataPacket[]>(
    `SELECT
      (SELECT COUNT(*) FROM clues WHERE questId = ?) AS totalClues,
      (SELECT COUNT(DISTINCT clueId) FROM userProgress WHERE userId = ? AND questId = ?) AS completedClues`,
    [puzzle.questId, input.userId, puzzle.questId],
  );

  return {
    solved: true,
    progressId: result.insertId || null,
    questComplete:
      Number(completionRows[0]?.totalClues ?? 0) > 0 &&
      Number(completionRows[0]?.completedClues ?? 0) >=
        Number(completionRows[0]?.totalClues ?? 0),
  };
};
