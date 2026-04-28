import type { Request, Response } from "express";
import {
  getQuests,
  getQuestByCityName,
  getQuestById,
  createQuest,
} from "../services/questsService.ts";

export const getQuestsController = async (_req: Request, res: Response) => {
  try {
    const quests = await getQuests();
    res.json(quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch quests" });
  }
};

export const getQuestByCityNameController = async (
  req: Request,
  res: Response,
) => {
  const cityNameParam = req.params.cityName;
  const cityName = Array.isArray(cityNameParam) ? cityNameParam[0] : cityNameParam;
  if (!cityName) return res.status(400).json({ error: "City name is required" });
  try {
    const quests = await getQuestByCityName(cityName);
    res.json(quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch quests for city" });
  }
};

export const getQuestByIdController = async (req: Request, res: Response) => {
  const questId = Number(req.params.questId);
  if (isNaN(questId))
    return res.status(400).json({ error: "Invalid quest ID" });
  try {
    const quest = await getQuestById(questId);
    if (!quest) return res.status(404).json({ error: "Quest not found" });
    res.json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch quest" });
  }
};

export const createQuestController = async (req: Request, res: Response) => {
  const { cityId, questName, questShortDescription, questIntroImage } =
    req.body as {
      cityId: number;
      questName: string;
      questShortDescription?: string;
      questIntroImage?: string;
    };
  if (!cityId || !questName) {
    return res.status(400).json({ error: "cityId and questName are required" });
  }
  try {
    const id = await createQuest(
      cityId,
      questName,
      questShortDescription ?? null,
      questIntroImage ?? null,
    );
    res.status(201).json({ message: "Quest created", questId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create quest" });
  }
};
