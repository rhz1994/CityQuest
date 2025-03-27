const db = require("../db");

async function getUserProgress(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM userProgress");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching userProgress:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getUserProgress,
};
