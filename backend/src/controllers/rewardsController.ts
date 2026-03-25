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
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  try {
    const rewards = await getRewardsByUserId(userId);
    res.json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch rewards for user" });
  }
};
