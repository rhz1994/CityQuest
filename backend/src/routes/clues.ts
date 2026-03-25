import { Router } from "express";
import {
  getCluesController,
  getClueByIdController,
  getCluesByQuestIdController,
} from "../controllers/cluesController.ts";

const router = Router();

router.get("/", getCluesController);
router.get("/quest/:questId", getCluesByQuestIdController);
router.get("/:clueId", getClueByIdController);

export default router;
