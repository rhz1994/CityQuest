import fs from "node:fs/promises";
import path from "node:path";

import { database } from "./database.ts";

async function seed() {
  const sql = await fs.readFile(
    path.join(import.meta.dirname, "database", "seed.sql"),
    "utf8",
  );
  const statements = sql.split(";").filter((s) => s.trim().length > 0);
  for (const statement of statements) {
    await database.execute(statement);
  }
}
seed();
