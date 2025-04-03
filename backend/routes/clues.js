const express = require("express");
const router = express.Router();
const {
  getClues,
  getClueByClueId,
  getCluesByQuestId,
} = require("../controllers/cluesController");

// Hämta alla ledtrådar

router.get("/", getClues);

// Hämta ledtrådar baserat på clueId
router.get("/:clueId", getClueByClueId);

// Hämta ledtrådar baserat på questId

router.get("/quest/:questId", getCluesByQuestId);

module.exports = router;
