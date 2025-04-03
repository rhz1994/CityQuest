const db = require("../db");

// Hämta alla ledtrådar
async function getClues(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM clues");
    if (rows.length === 0) {
      return res.status(404).json({ error: "Clues not found" });
    }
    res.json(rows);
  } catch (err) {
    console.error("Error fetching clues", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Hämta ledtrådar efter clueID
async function getClueByClueId(req, res) {
  const { clueId } = req.params; // Hämta clueId från URL:en

  try {
    const [rows] = await db.query("SELECT * FROM clues WHERE clueId = ?", [
      clueId,
    ]);

    // Om clueId inte finns, returnera 404
    if (rows.length === 0) {
      return res.status(404).json({ error: "Clue not found" });
    }

    res.json(rows[0]); // Returnera en specifik ledtråd
  } catch (err) {
    console.error("Error fetching clue by ID:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Hämta alla ledtrådar som tillhör ett specifikt questId
async function getCluesByQuestId(req, res) {
  const { questId } = req.params; // Hämtar questId från URL:en

  try {
    const [rows] = await db.query("SELECT * FROM clues WHERE questId = ?", [
      questId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No clues found for this quest" });
    }

    res.json(rows); // Returnera alla ledtrådar för questet
  } catch (err) {
    console.error("Error fetching clues by quest ID:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = { getClues, getClueByClueId, getCluesByQuestId };
