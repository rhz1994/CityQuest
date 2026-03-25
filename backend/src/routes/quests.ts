import { Router } from "express";
import {
  getQuestsController,
  getQuestByCityNameController,
  getQuestByIdController,
  createQuestController,
} from "../controllers/questsController.ts";

const router = Router();

router.get("/", getQuestsController);
router.get("/city/:cityName", getQuestByCityNameController);
router.get("/:questId", getQuestByIdController);
router.post("/", createQuestController);

export default router;
