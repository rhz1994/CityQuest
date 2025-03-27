const db = require("../db");
// test
async function getCities(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM cities");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

async function createCity(req, res) {
  const { cityName, cityDescription } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO cities (cityName, cityDescription) VALUES (?, ?)",
      [cityName, cityDescription]
    );
    res.status(201).json({ message: "City created", id: result.insertId });
  } catch (err) {
    console.error("Error creating city:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

async function updateCity(req, res) {
  const { id } = req.params;
  const { cityName, cityDescription } = req.body;
  try {
    await db.query(
      "UPDATE cities SET cityName = ?, cityDescription = ? WHERE id = ?",
      [cityName, cityDescription, id]
    );
    res.json({ message: "City updated" });
  } catch (err) {
    console.error("Error updating city:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

async function deleteCity(req, res) {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM cities WHERE id = ?", [id]);
    res.json({ message: "City deleted" });
  } catch (err) {
    console.error("Error deleting city:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity,
};
