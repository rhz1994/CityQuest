const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardsController");

// Hämta alla belöningar
router.get("/", rewardsController.getRewards);

module.exports = router;
