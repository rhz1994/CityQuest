import { Router } from "express";
import {
  getCluesController,
  getClueByIdController,
  getCluesByQuestIdController,
  createClueController,
} from "../controllers/cluesController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getCluesController);
router.get("/quest/:questId", getCluesByQuestIdController);
router.get("/:clueId", getClueByIdController);
router.post("/", requireAuth, requireAdmin, createClueController);

export default router;
