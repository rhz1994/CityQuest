import { Router } from "express";
import {
  getLocationsController,
  getLocationByIdController,
  getLocationsByCityIdController,
  createLocationController,
} from "../controllers/locationsController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getLocationsController);
router.get("/city/:cityId", getLocationsByCityIdController);
router.get("/:locationId", getLocationByIdController);
router.post("/", requireAuth, requireAdmin, createLocationController);

export default router;
