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

// Funktion för att hämta quest baserat på stadens namn
async function getQuestByCityName(req, res) {
  const { cityName } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT quests.*, cities.cityName
FROM quests
JOIN cities ON cities.cityId = quests.cityId
WHERE cities.cityName = ? `,
      [cityName]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching quests", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

async function getQuestById(req, res) {
  const { questId } = req.params; // Hämta questId från URL-parametrar

  try {
    const [rows] = await db.query(
      `SELECT quests.*, cities.cityName, cities.latitude, cities.longitude
       FROM quests
       JOIN cities ON quests.cityId = cities.cityId
       WHERE quests.questId = ?`,
      [questId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Quest not found" }); // Om inget quest hittas
    }

    res.json(rows[0]); // Skicka det första (och enda) resultatet som json
  } catch (err) {
    console.error("Error fetching quest by id:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att skapa ett nytt quest
async function createQuest(req, res) {
  const { questName, questDescription } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO quests (questName, questDescription) VALUES (?, ?)",
      [questName, questDescription]
    );
    res.status(201).json({ message: "Quest created", id: result.insertId });
  } catch (err) {
    console.error("Error creating quest:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getQuestByCityName,
  getQuests,
  createQuest,
  getQuestById,
};
