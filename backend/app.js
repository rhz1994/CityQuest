const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

// Importera rutter
const citiesRoutes = require("./routes/cities");
const cluesRoutes = require("./routes/clues");
const locationsRoutes = require("./routes/locations");
const puzllesRoutes = require("./routes/puzzles");
const questsRoutes = require("./routes/quests");
const userProgressRoutes = require("./routes/userProgress");
const usersRoutes = require("./routes/users");
const rewardsRoutes = require("./routes/rewards");

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

// Koppla rutter
app.use("/cities", citiesRoutes);
app.use("/clues", cluesRoutes);
app.use("/locations", locationsRoutes);
app.use("/puzzles", puzllesRoutes);
app.use("/quests", questsRoutes);
app.use("/userProgress", userProgressRoutes);
app.use("/users", usersRoutes);
app.use("/rewards", rewardsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
