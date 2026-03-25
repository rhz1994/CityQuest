import { Router } from "express";
import {
  getUserProgressController,
  getUserProgressByUserIdController,
  saveProgressController,
} from "../controllers/userProgressController.ts";

const router = Router();

router.get("/", getUserProgressController);
router.get("/user/:userId", getUserProgressByUserIdController);
router.post("/", saveProgressController);

export default router;
