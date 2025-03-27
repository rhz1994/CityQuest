const express = require("express");
const router = express.Router();
const cluesController = require("../controllers/cluesController");

// GET: Hämta alla ledtrådar
router.get("/", cluesController.getClues);

module.exports = router;
