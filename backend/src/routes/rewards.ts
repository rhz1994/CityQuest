import { Router } from "express";
import {
  getRewardsController,
  getRewardsByUserIdController,
} from "../controllers/rewardsController.ts";

const router = Router();

router.get("/", getRewardsController);
router.get("/user/:userId", getRewardsByUserIdController);

export default router;
