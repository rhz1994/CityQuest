const db = require("../db");

// Funktion för att hämta alla quests
async function getPuzzles(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM puzzles");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching puzzles:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getPuzzles,
};
