import { Router } from "express";
import {
  getLocationsController,
  getLocationByIdController,
  getLocationsByCityIdController,
} from "../controllers/locationsController.ts";

const router = Router();

router.get("/", getLocationsController);
router.get("/city/:cityId", getLocationsByCityIdController);
router.get("/:locationId", getLocationByIdController);

export default router;
