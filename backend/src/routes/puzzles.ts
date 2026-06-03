import { Router } from "express";
import {
  getPuzzlesController,
  getPuzzleByIdController,
  getPuzzlesByClueIdController,
  solvePuzzleController,
} from "../controllers/puzzlesController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getPuzzlesController);
router.get("/clue/:clueId", getPuzzlesByClueIdController);
router.post("/:puzzleId/solve", requireAuth, solvePuzzleController);
router.get("/:puzzleId", getPuzzleByIdController);

export default router;
