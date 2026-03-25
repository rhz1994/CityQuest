import { Router } from "express";
import {
  getCitiesController,
  getCityByNameController,
  getCityByIdController,
  createCityController,
} from "../controllers/citiesController.ts";

const router = Router();

router.get("/", getCitiesController);
router.get("/id/:id", getCityByIdController);
router.get("/:cityName", getCityByNameController);
router.post("/", createCityController);

export default router;
