import { database } from "../../database.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { UserProgress } from "../types/types.ts";

export const getUserProgress = async (): Promise<UserProgress[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM userProgress",
  );
  return rows as UserProgress[];
};

export const getUserProgressByUserId = async (
  userId: number,
): Promise<UserProgress[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM userProgress WHERE userId = ?",
    [userId],
  );
  return rows as UserProgress[];
};

export const saveProgress = async (
  userId: number,
  questId: number,
  clueId: number,
): Promise<number> => {
  const [result] = await database.query<ResultSetHeader>(
    "INSERT INTO userProgress (userId, questId, clueId) VALUES (?, ?, ?)",
    [userId, questId, clueId],
  );
  return result.insertId;
};
