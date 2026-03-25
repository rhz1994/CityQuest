import { Router } from "express";
import {
  getUserProfileController,
  getUserByIdController,
  createUserController,
  updateUserController,
} from "../controllers/usersController.ts";

const router = Router();

router.get("/:name", getUserProfileController);
router.get("/id/:id", getUserByIdController);
router.post("/", createUserController);
router.put("/:id", updateUserController);

export default router;
