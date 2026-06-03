import { Router } from "express";
import {
  getUserProfileController,
  getUserByIdController,
  createUserController,
  updateUserController,
} from "../controllers/usersController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/:name", requireAuth, getUserProfileController);
router.get("/id/:id", requireAuth, getUserByIdController);
router.post("/", requireAuth, requireAdmin, createUserController);
router.put("/:id", requireAuth, updateUserController);

export default router;
