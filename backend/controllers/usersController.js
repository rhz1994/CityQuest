const db = require("../db");

// Funktion för att hämta användarens egen profil
async function getUserProfile(req, res) {
  const userNameFromParams = req.params.name; // Användarens namn från URL:en

  try {
    // Hämta användarens data från databasen baserat på användarnamn
    const [rows] = await db.query("SELECT * FROM users WHERE userName = ?", [
      userNameFromParams,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Skicka tillbaka användarens profil
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att skapa en ny användare
async function createUser(req, res) {
  const { userName, userEmail } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO users (userName, userEmail) VALUES (?, ?)",
      [userName, userEmail]
    );
    res.status(201).json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att uppdatera en användare (PUT) - endast om användaren försöker uppdatera sin egen profil
async function updateUser(req, res) {
  const { id } = req.params;
  const { userName, userEmail } = req.body;

  // Kontrollera om användaren försöker uppdatera sin egen profil
  if (id !== userName) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this profile" });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET userName = ?, userEmail = ? WHERE userName = ?",
      [userName, userEmail, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att ta bort en användare (DELETE) - endast om användaren försöker ta bort sin egen profil
async function deleteUser(req, res) {
  const userNameFromParams = req.params.name; // Användarens namn från URL:en

  // Kontrollera om användaren försöker ta bort sin egen profil
  if (userNameFromParams !== userNameFromParams) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this profile" });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE userName = ?", [
      userNameFromParams,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

// Funktion för att uppdatera specifika fält (PATCH) - endast om användaren försöker uppdatera sin egen profil
async function patchUser(req, res) {
  const { id } = req.params;
  const { userName, userEmail } = req.body;

  // Kontrollera om användaren försöker uppdatera sin egen profil
  if (id !== userName) {
    return res
      .status(403)
      .json({ error: "You are not authorized to patch this profile" });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET userName = ?, userEmail = ? WHERE userName = ?",
      [userName, userEmail, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User patched" });
  } catch (err) {
    console.error("Error patching user:", err);
    res.status(500).json({ error: "Database query failed" });
  }
}

module.exports = {
  getUserProfile,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
};
