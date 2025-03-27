const db = require("../db");

// Funktion för att hämta alla belöningar
async function getRewards(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM rewards");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching rewards:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getRewards,
};
