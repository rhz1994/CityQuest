require("dotenv").config(); // Ladda in miljövariabler

const mysql = require("mysql2");

// Skapa en MySQL-anslutning
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db.promise(); // Exportera för att använda Promise-baserad API
