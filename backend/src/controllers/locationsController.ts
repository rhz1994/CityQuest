import type { Request, Response } from "express";
import {
  getLocations,
  getLocationById,
  getLocationsByCityId,
} from "../services/locationsService.ts";

export const getLocationsController = async (_req: Request, res: Response) => {
  try {
    const locations = await getLocations();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch locations" });
  }
};

export const getLocationByIdController = async (
  req: Request,
  res: Response,
) => {
  const locationId = Number(req.params.locationId);
  if (isNaN(locationId))
    return res.status(400).json({ error: "Invalid location ID" });
  try {
    const location = await getLocationById(locationId);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch location" });
  }
};

export const getLocationsByCityIdController = async (
  req: Request,
  res: Response,
) => {
  const cityId = Number(req.params.cityId);
  if (isNaN(cityId)) return res.status(400).json({ error: "Invalid city ID" });
  try {
    const locations = await getLocationsByCityId(cityId);
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch locations for city" });
  }
};
