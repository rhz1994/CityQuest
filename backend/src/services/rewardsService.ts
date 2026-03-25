import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { Reward } from "../types/types.ts";

export const getRewards = async (): Promise<Reward[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM rewards");
  return rows as Reward[];
};

export const getRewardsByUserId = async (userId: number): Promise<Reward[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM rewards WHERE userId = ?",
    [userId],
  );
  return rows as Reward[];
};
