import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import citiesRoutes from "./src/routes/cities.ts";
import questsRoutes from "./src/routes/quests.ts";
import locationsRoutes from "./src/routes/locations.ts";
import cluesRoutes from "./src/routes/clues.ts";
import puzzlesRoutes from "./src/routes/puzzles.ts";
import usersRoutes from "./src/routes/users.ts";
import userProgressRoutes from "./src/routes/userProgress.ts";
import rewardsRoutes from "./src/routes/rewards.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/cities", citiesRoutes);
app.use("/quests", questsRoutes);
app.use("/locations", locationsRoutes);
app.use("/clues", cluesRoutes);
app.use("/puzzles", puzzlesRoutes);
app.use("/users", usersRoutes);
app.use("/userProgress", userProgressRoutes);
app.use("/rewards", rewardsRoutes);

app.listen(PORT, () => {
  console.log(`City Quest server running on http://localhost:${PORT}`);
});
