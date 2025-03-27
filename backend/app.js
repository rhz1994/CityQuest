const express = require("express");
const app = express();
const port = 3000;

// Importera rutter
const citiesRoutes = require("./routes/cities");
const cluesRoutes = require("./routes/clues");
const locationsRoutes = require("./routes/locations");
const questsRoutes = require("./routes/quests");
const userProgressRoutes = require("./routes/userProgress");
const usersRoutes = require("./routes/users");
const rewardsRoutes = require("./routes/rewards");

app.use(express.json()); // För att kunna ta emot JSON-requests

// Koppla rutter
app.use("/cities", citiesRoutes);
app.use("/clues", cluesRoutes);
app.use("/locations", locationsRoutes);
app.use("/quests", questsRoutes);
app.use("/userProgress", userProgressRoutes);
app.use("/users", usersRoutes);
app.use("/rewards", rewardsRoutes); // Lägg till routes för belöningar

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
