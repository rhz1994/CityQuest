import type { Request, Response } from "express";
import {
  getUserProgress,
  getUserProgressByUserId,
  saveProgress,
} from "../services/userProgressService.ts";

export const getUserProgressController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const progress = await getUserProgress();
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch user progress" });
  }
};

export const getUserProgressByUserIdController = async (
  req: Request,
  res: Response,
) => {
  const userId = Number(req.params.userId);
  const authUserId = Number(res.locals.authUserId);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  if (!Number.isFinite(authUserId) || authUserId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (authUserId !== userId) {
    return res.status(403).json({ error: "Cannot read another user's progress" });
  }
  try {
    const progress = await getUserProgressByUserId(userId);
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch progress for user" });
  }
};

export const saveProgressController = async (req: Request, res: Response) => {
  const authUserId = Number(res.locals.authUserId);
  const { questId, clueId } = req.body as {
    questId: number;
    clueId: number;
  };
  if (!Number.isFinite(authUserId) || authUserId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!questId || !clueId) {
    return res
      .status(400)
      .json({ error: "questId and clueId are required" });
  }
  try {
    const id = await saveProgress(authUserId, questId, clueId);
    res.status(201).json({ message: "Progress saved", progressId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save progress" });
  }
};
