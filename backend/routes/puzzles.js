const express = require("express");
const router = express.Router();
const puzzlesController = require("../controllers/puzzlesController");

router.get("/", puzzlesController.getPuzzles);

module.exports = router;
