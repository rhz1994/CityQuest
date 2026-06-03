import { Router } from "express";
import {
  getCitiesController,
  getCityByNameController,
  getCityByIdController,
  createCityController,
} from "../controllers/citiesController.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.get("/", getCitiesController);
router.get("/id/:id", getCityByIdController);
router.get("/:cityName", getCityByNameController);
router.post("/", requireAuth, requireAdmin, createCityController);

export default router;
