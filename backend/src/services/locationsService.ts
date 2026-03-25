import { database } from "../../database.ts";
import type { RowDataPacket } from "mysql2";
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
