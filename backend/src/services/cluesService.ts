import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { Clue, ClueWithDetails } from "../types/types.ts";

export const getClues = async (): Promise<Clue[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM clues");
  return rows as Clue[];
};

export const getClueById = async (clueId: number): Promise<Clue | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM clues WHERE clueId = ?",
    [clueId],
  );
  return rows.length > 0 ? (rows[0] as Clue) : null;
};

export const getCluesByQuestId = async (
  questId: number,
): Promise<ClueWithDetails[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT
      clues.*,
      puzzles.puzzleId,
      puzzles.puzzleName,
      puzzles.puzzleDescription,
      puzzles.puzzleAnswer,
      locations.locationName,
      locations.latitude,
      locations.longitude,
      locations.locationDescription,
      locations.locationImage
    FROM clues
    LEFT JOIN puzzles ON clues.clueId = puzzles.clueId
    LEFT JOIN locations ON clues.locationId = locations.locationId
    WHERE clues.questId = ?
    ORDER BY clues.clueOrder ASC`,
    [questId],
  );
  return rows as ClueWithDetails[];
};
