const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

// GET: Hämta alla platser
router.get("/", locationsController.getLocations);

// POST: Skapa en ny plats
router.post("/", locationsController.createLocation);

module.exports = router;
