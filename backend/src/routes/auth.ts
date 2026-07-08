import { Router } from "express";
import {
  exchangeSessionController,
  logoutAllController,
  logoutController,
  meController,
  refreshSessionController,
} from "../controllers/authController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";
import { authRateLimiter } from "../middleware/rateLimits.ts";

const router = Router();

router.post("/exchange", authRateLimiter, exchangeSessionController);
router.post("/refresh", authRateLimiter, refreshSessionController);
router.post("/logout", logoutController);
router.post("/logout-all", requireAuth, logoutAllController);
router.get("/me", requireAuth, meController);

export default router;
