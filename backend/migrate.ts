import fs from "node:fs/promises";
import path from "node:path";
import type { RowDataPacket } from "mysql2";

import { database } from "./database.ts";

async function migrate() {
  await database.execute(`CREATE TABLE IF NOT EXISTS migrations (
    migrationId INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT filename FROM migrations",
  );
  const applied = new Set(rows.map((row) => row.filename));
  const migrationsDir = path.join(
    import.meta.dirname,
    "database",
    "migrations",
  );
  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }
    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    const statements = sql.split(";").filter((s) => s.trim().length > 0);
    for (const statement of statements) {
      await database.execute(statement);
    }
    await database.execute("INSERT INTO migrations (filename) VALUES (?)", [
      file,
    ]);
    console.log(`Applied migration: ${file}`);
  }
  console.log("Migration complete");
}
migrate();
