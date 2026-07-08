import { Router } from "express";
import {
  getPuzzlesController,
  getPuzzleByIdController,
  getPuzzlesByClueIdController,
  solvePuzzleController,
  createPuzzleController,
} from "../controllers/puzzlesController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { puzzleSolveRateLimiter } from "../middleware/rateLimits.ts";

const router = Router();

router.get("/", getPuzzlesController);
router.get("/clue/:clueId", getPuzzlesByClueIdController);
router.post(
  "/:puzzleId/solve",
  requireAuth,
  puzzleSolveRateLimiter,
  solvePuzzleController,
);
router.get("/:puzzleId", getPuzzleByIdController);
router.post("/", requireAuth, requireAdmin, createPuzzleController);

export default router;
