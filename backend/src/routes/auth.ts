import { Router } from "express";
import {
  exchangeSessionController,
  logoutAllController,
  logoutController,
  meController,
  refreshSessionController,
} from "../controllers/authController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.post("/exchange", exchangeSessionController);
router.post("/refresh", refreshSessionController);
router.post("/logout", logoutController);
router.post("/logout-all", requireAuth, logoutAllController);
router.get("/me", requireAuth, meController);

export default router;
