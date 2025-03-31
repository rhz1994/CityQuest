const express = require("express");
const router = express.Router();
const citiesController = require("../controllers/citiesController");

router.get("/", citiesController.getCities);

router.get("/:cityName", citiesController.getCityByName);

router.post("/", citiesController.createCity);

router.put("/:id", citiesController.updateCity);

router.delete("/:id", citiesController.deleteCity);

module.exports = router;
