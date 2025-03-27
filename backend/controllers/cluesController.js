const db = require("../db");

async function getClues(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM clues");
    res.json(rows); // Skicka tillbaka data som JSON
  } catch (err) {
    console.error("Error fetching clues:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getClues,
};
