import type { Request, Response } from "express";
import {
  getClues,
  getClueById,
  getCluesByQuestId,
  createClue,
} from "../services/cluesService.ts";

export const getCluesController = async (_req: Request, res: Response) => {
  try {
    const clues = await getClues();
    res.json(clues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch clues" });
  }
};

export const getClueByIdController = async (req: Request, res: Response) => {
  const clueId = Number(req.params.clueId);
  if (isNaN(clueId)) return res.status(400).json({ error: "Invalid clue ID" });
  try {
    const clue = await getClueById(clueId);
    if (!clue) return res.status(404).json({ error: "Clue not found" });
    res.json(clue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch clue" });
  }
};

export const getCluesByQuestIdController = async (
  req: Request,
  res: Response,
) => {
  const questId = Number(req.params.questId);
  if (isNaN(questId))
    return res.status(400).json({ error: "Invalid quest ID" });
  try {
    const clues = await getCluesByQuestId(questId);
    res.json(clues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch clues for quest" });
  }
};

export const createClueController = async (req: Request, res: Response) => {
  const { questId, locationId, clueDescription, clueOrder } = req.body as {
    questId: number;
    locationId: number;
    clueDescription: string;
    clueOrder: number;
  };
  if (!questId || !locationId || clueDescription == null || clueOrder == null) {
    return res.status(400).json({
      error: "questId, locationId, clueDescription, and clueOrder are required",
    });
  }
  try {
    const id = await createClue(
      questId,
      locationId,
      clueDescription,
      clueOrder,
    );
    res.status(201).json({ message: "Clue created", clueId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create clue" });
  }
};
