import { Router } from "express";
import {
  getRewardsController,
  getRewardsByUserIdController,
} from "../controllers/rewardsController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getRewardsController);
router.get("/user/:userId", requireAuth, getRewardsByUserIdController);

export default router;
