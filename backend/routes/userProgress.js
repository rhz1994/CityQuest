const express = require("express");
const router = express.Router();
const userProgressController = require("../controllers/userProgressController");

// GET: Hämta alla användares progress
router.get("/", userProgressController.getUserProgress);

module.exports = router;
