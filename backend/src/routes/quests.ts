import { Router } from "express";
import {
  getQuestsController,
  getQuestByCityNameController,
  getQuestByIdController,
  createQuestController,
} from "../controllers/questsController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getQuestsController);
router.get("/city/:cityName", getQuestByCityNameController);
router.get("/:questId", getQuestByIdController);
router.post("/", requireAuth, requireAdmin, createQuestController);

export default router;
