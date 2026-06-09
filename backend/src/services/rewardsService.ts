import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { Reward } from "../types/types.ts";

export const getRewards = async (): Promise<Reward[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM rewards");
  return rows as Reward[];
};

export const getRewardsByUserId = async (userId: number): Promise<Reward[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT
     rewards.rewardId,
     rewards.userId,
     rewards.questId,
     rewards.rewardName,
     rewards.awardedAt,
     quests.questName,
     quests.questShortDescription
   FROM rewards
   JOIN quests ON quests.questId = rewards.questId
   WHERE rewards.userId = ?
   ORDER BY rewards.awardedAt DESC`,
    [userId],
  );
  return rows as Reward[];
};
