import { Router } from "express";
import {
  getPuzzlesController,
  getPuzzleByIdController,
  getPuzzlesByClueIdController,
} from "../controllers/puzzlesController.ts";

const router = Router();

router.get("/", getPuzzlesController);
router.get("/clue/:clueId", getPuzzlesByClueIdController);
router.get("/:puzzleId", getPuzzleByIdController);

export default router;
