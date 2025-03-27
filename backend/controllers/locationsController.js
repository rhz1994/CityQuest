const db = require("../db");

async function getLocations(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM locations");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}
async function createLocation(req, res) {
  const { locationName, locationDescription, cityId } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO locations (name, description, cityId) VALUES (?, ?, ?)",
      [locationName, locationDescription, cityId]
    );
    res.status(201).json({ message: "Location created", id: result.insertId });
  } catch (err) {
    console.error("Error creating location:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getLocations,
  createLocation,
};
