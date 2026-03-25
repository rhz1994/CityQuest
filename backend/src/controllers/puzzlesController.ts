import type { Request, Response } from "express";
import {
  getPuzzles,
  getPuzzleById,
  getPuzzlesByClueId,
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
