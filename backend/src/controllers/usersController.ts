import type { Request, Response } from "express";
import {
  getUserByName,
  getUserById,
  createUser,
  updateUser,
} from "../services/usersService.ts";

export const getUserProfileController = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const user = await getUserByName(name);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch user" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const { userName, userEmail } = req.body as {
    userName: string;
    userEmail: string;
  };
  if (!userName || !userEmail) {
    return res
      .status(400)
      .json({ error: "userName and userEmail are required" });
  }
  try {
    const id = await createUser(userName, userEmail);
    res.status(201).json({ message: "User created", userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { userName, userEmail } = req.body as {
    userName: string;
    userEmail: string;
  };
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  if (!userName || !userEmail) {
    return res
      .status(400)
      .json({ error: "userName and userEmail are required" });
  }
  try {
    const updated = await updateUser(userId, userName, userEmail);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update user" });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch user" });
  }
};
