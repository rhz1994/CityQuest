import type { Request, Response } from "express";
import {
  getCities,
  getCityByName,
  getCityById,
  createCity,
} from "../services/citiesService.ts";

export const getCitiesController = async (_req: Request, res: Response) => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch cities" });
  }
};

export const getCityByNameController = async (req: Request, res: Response) => {
  const cityNameParam = req.params.cityName;
  const cityName = Array.isArray(cityNameParam) ? cityNameParam[0] : cityNameParam;
  if (!cityName) return res.status(400).json({ error: "City name is required" });
  try {
    const city = await getCityByName(cityName);
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch city" });
  }
};

export const getCityByIdController = async (req: Request, res: Response) => {
  const cityId = Number(req.params.id);
  if (isNaN(cityId)) return res.status(400).json({ error: "Invalid city ID" });
  try {
    const city = await getCityById(cityId);
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch city" });
  }
};

export const createCityController = async (req: Request, res: Response) => {
  const { cityName, latitude, longitude, cityImage } = req.body as {
    cityName: string;
    latitude: number;
    longitude: number;
    cityImage?: string;
  };
  if (!cityName || latitude == null || longitude == null) {
    return res
      .status(400)
      .json({ error: "cityName, latitude, and longitude are required" });
  }
  try {
    const id = await createCity(
      cityName,
      latitude,
      longitude,
      cityImage ?? null,
    );
    res.status(201).json({ message: "City created", cityId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create city" });
  }
};
