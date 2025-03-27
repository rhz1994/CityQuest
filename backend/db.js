// db.js
const mysql = require("mysql2");

// Skapa en MySQL-anslutning
const db = mysql.createPool({
  host: "localhost",
  user: "root", // Byt till ditt användarnamn för databasen
  password: "password", // Byt till ditt lösenord för databasen
  database: "CityQuest", // Byt till ditt databasnamn
});

module.exports = db.promise(); // Exportera för att använda Promise-baserad API
