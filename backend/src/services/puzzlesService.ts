import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { Puzzle } from "../types/types.ts";

export const getPuzzles = async (): Promise<Puzzle[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM puzzles");
  return rows as Puzzle[];
};

export const getPuzzleById = async (
  puzzleId: number,
): Promise<Puzzle | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM puzzles WHERE puzzleId = ?",
    [puzzleId],
  );
  return rows.length > 0 ? (rows[0] as Puzzle) : null;
};

export const getPuzzlesByClueId = async (clueId: number): Promise<Puzzle[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM puzzles WHERE clueId = ?",
    [clueId],
  );
  return rows as Puzzle[];
};
