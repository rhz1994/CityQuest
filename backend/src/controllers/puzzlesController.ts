import type { Request, Response } from "express";
import {
  getPuzzles,
  getPuzzleById,
  getPuzzlesByClueId,
  solvePuzzle,
} from "../services/puzzlesService.ts";

export const getPuzzlesController = async (_req: Request, res: Response) => {
  try {
    const puzzles = await getPuzzles();
    res.json(puzzles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch puzzles" });
  }
};

export const getPuzzleByIdController = async (req: Request, res: Response) => {
  const puzzleId = Number(req.params.puzzleId);
  if (isNaN(puzzleId))
    return res.status(400).json({ error: "Invalid puzzle ID" });
  try {
    const puzzle = await getPuzzleById(puzzleId);
    if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });
    res.json(puzzle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch puzzle" });
  }
};

export const getPuzzlesByClueIdController = async (
  req: Request,
  res: Response,
) => {
  const clueId = Number(req.params.clueId);
  if (isNaN(clueId)) return res.status(400).json({ error: "Invalid clue ID" });
  try {
    const puzzles = await getPuzzlesByClueId(clueId);
    res.json(puzzles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch puzzles for clue" });
  }
};

export const solvePuzzleController = async (req: Request, res: Response) => {
  const puzzleId = Number(req.params.puzzleId);
  const userId = Number(res.locals.authUserId);
  const { answer, latitude, longitude } = req.body as {
    answer?: string;
    latitude?: number;
    longitude?: number;
  };

  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!Number.isFinite(puzzleId) || puzzleId <= 0) {
    return res.status(400).json({ error: "Invalid puzzle ID" });
  }
  if (typeof answer !== "string" || !answer.trim()) {
    return res.status(400).json({ error: "answer is required" });
  }

  try {
    const result = await solvePuzzle({
      userId,
      puzzleId,
      answer,
      latitude,
      longitude,
    });
    if (!result.solved) {
      return res.status(422).json({ error: "Wrong answer", solved: false });
    }
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not solve puzzle";
    const status =
      message === "Puzzle not found"
        ? 404
        : message.includes("Location") ||
            message.includes("close") ||
            message.includes("Previous")
          ? 403
          : 500;
    console.error(error);
    return res.status(status).json({ error: message });
  }
};
