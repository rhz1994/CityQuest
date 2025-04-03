const express = require("express");
const router = express.Router();
const questsController = require("../controllers/questsController");

// GET: Hämta alla quests
router.get("/", questsController.getQuests);

// Hämta quests baserat på stadens namn

router.get("/city/:cityName", questsController.getQuestByCityName);

// GET: Hämta ett specifikt quest baserat på questId
router.get("/:questId", questsController.getQuestById); // Dynamisk route för questId

// POST: Skapa en ny quest
router.post("/", questsController.createQuest);

module.exports = router;
