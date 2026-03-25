import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { Quest, QuestWithCity } from "../types/types.ts";

export const getQuests = async (): Promise<Quest[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM quests");
  return rows as Quest[];
};

export const getQuestByCityName = async (
  cityName: string,
): Promise<Quest[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT quests.*
     FROM quests
     JOIN cities ON cities.cityId = quests.cityId
     WHERE cities.cityName = ?`,
    [cityName],
  );
  return rows as Quest[];
};

export const getQuestById = async (
  questId: number,
): Promise<QuestWithCity | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    `SELECT quests.*, cities.cityName, cities.latitude, cities.longitude
     FROM quests
     JOIN cities ON quests.cityId = cities.cityId
     WHERE quests.questId = ?`,
    [questId],
  );
  return rows.length > 0 ? (rows[0] as QuestWithCity) : null;
};

export const createQuest = async (
  cityId: number,
  questName: string,
  questShortDescription: string | null,
  questIntroImage: string | null,
): Promise<number> => {
  const [result] = await database.query<RowDataPacket[]>(
    "INSERT INTO quests (cityId, questName, questShortDescription, questIntroImage) VALUES (?, ?, ?, ?)",
    [cityId, questName, questShortDescription, questIntroImage],
  );
  return (result as any).insertId as number;
};
