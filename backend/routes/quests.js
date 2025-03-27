const express = require("express");
const router = express.Router();
const questsController = require("../controllers/questsController");

// GET: Hämta alla quests
router.get("/", questsController.getQuests);

// POST: Skapa en ny quest
router.post("/", questsController.createQuest);

module.exports = router;
