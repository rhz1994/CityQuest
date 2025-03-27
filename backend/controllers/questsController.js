const db = require("../db");

// Funktion för att hämta alla quests
async function getQuests(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM quests");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching quests:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att skapa ett nytt quest
async function createQuest(req, res) {
  const { questName, questDescription } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO quests (name, description) VALUES (?, ?)",
      [questName, questDescription]
    );
    res.status(201).json({ message: "Quest created", id: result.insertId });
  } catch (err) {
    console.error("Error creating quest:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getQuests,
  createQuest,
};
