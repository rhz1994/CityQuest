import { Router } from "express";
import {
  getRewardsController,
  getRewardsByUserIdController,
} from "../controllers/rewardsController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", requireAuth, requireAdmin, getRewardsController);
router.get("/user/:userId", requireAuth, getRewardsByUserIdController);

export default router;
