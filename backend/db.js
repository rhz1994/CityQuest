require("dotenv").config();

const mysql = require("mysql2");

// Skapa en MySQL-anslutning
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  decimalNumbers: true, // <-- Lägg till denna rad!
});

module.exports = db.promise();
