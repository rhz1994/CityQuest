import { Router } from "express";
import {
  getUserProgressController,
  getUserProgressByUserIdController,
  saveProgressController,
} from "../controllers/userProgressController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", requireAuth, requireAdmin, getUserProgressController);
router.get("/user/:userId", requireAuth, getUserProgressByUserIdController);
router.post("/", requireAuth, saveProgressController);

export default router;
