import type { Request, Response } from "express";
import { getRewards, getRewardsByUserId } from "../services/rewardsService.ts";

export const getRewardsController = async (_req: Request, res: Response) => {
  try {
    const rewards = await getRewards();
    res.json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch rewards" });
  }
};

export const getRewardsByUserIdController = async (
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
    return res.status(403).json({ error: "Cannot read another user's rewards" });
  }
  try {
    const rewards = await getRewardsByUserId(userId);
    res.json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch rewards for user" });
  }
};
