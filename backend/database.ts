import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const database = await mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "secret",
  database: process.env.DB_NAME ?? "cityquest",
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
});
