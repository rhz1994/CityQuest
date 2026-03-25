import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
import type { City } from "../types/types.ts";

export const getCities = async (): Promise<City[]> => {
  const [rows] = await database.query<RowDataPacket[]>("SELECT * FROM cities");
  return rows as City[];
};

export const getCityByName = async (cityName: string): Promise<City | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM cities WHERE cityName = ?",
    [cityName],
  );
  return rows.length > 0 ? (rows[0] as City) : null;
};

export const getCityById = async (cityId: number): Promise<City | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM cities WHERE cityId = ?",
    [cityId],
  );
  return rows.length > 0 ? (rows[0] as City) : null;
};

export const createCity = async (
  cityName: string,
  latitude: number,
  longitude: number,
  cityImage: string | null,
): Promise<number> => {
  const [result] = await database.query<RowDataPacket[]>(
    "INSERT INTO cities (cityName, latitude, longitude, cityImage) VALUES (?, ?, ?, ?)",
    [cityName, latitude, longitude, cityImage],
  );
  return (result as any).insertId as number;
};
