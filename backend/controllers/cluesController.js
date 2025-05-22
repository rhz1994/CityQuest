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
  const { questId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
        clues.*,
        puzzles.puzzleId,
        puzzles.puzzleName,
        puzzles.puzzleDescription,
        puzzles.puzzleAnswer,
        locations.locationName,
        locations.latitude,
        locations.longitude,
        locations.locationDescription,
        locations.locationImage

      FROM clues
      LEFT JOIN puzzles ON clues.clueId = puzzles.clueId
      LEFT JOIN locations ON clues.locationId = locations.locationId
      WHERE clues.questId = ?`,
      [questId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching clues with puzzles:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = { getClues, getClueByClueId, getCluesByQuestId };
