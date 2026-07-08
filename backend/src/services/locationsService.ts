import { database } from "../../database.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { Location } from "../types/types.ts";

export const getLocations = async (): Promise<Location[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM locations",
  );
  return rows as Location[];
};

export const getLocationById = async (
  locationId: number,
): Promise<Location | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM locations WHERE locationId = ?",
    [locationId],
  );
  return rows.length > 0 ? (rows[0] as Location) : null;
};

export const getLocationsByCityId = async (
  cityId: number,
): Promise<Location[]> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM locations WHERE cityId = ?",
    [cityId],
  );
  return rows as Location[];
};

export const createLocation = async (
  cityId: number,
  locationName: string,
  latitude: number,
  longitude: number,
  locationDescription: string | null,
): Promise<number> => {
  const [result] = await database.query<ResultSetHeader>(
    "INSERT INTO locations (cityId, locationName, latitude, longitude, locationDescription) VALUES (?, ?, ?, ?, ?)",
    [cityId, locationName, latitude, longitude, locationDescription],
  );
  return result.insertId;
};
