import { Router } from "express";
import {
  getUserProfileController,
  getUserByIdController,
  createUserController,
  updateUserController,
} from "../controllers/usersController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/:name", getUserProfileController);
router.get("/id/:id", getUserByIdController);
router.post("/", createUserController);
router.put("/:id", requireAuth, updateUserController);

export default router;
