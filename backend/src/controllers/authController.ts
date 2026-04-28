import type { Request, Response } from "express";
import {
  exchangeIdentityForSession,
  refreshSession,
  revokeAllUserSessions,
  revokeSession,
} from "../services/authService.ts";
import { getUserById } from "../services/usersService.ts";
import type { AuthProvider } from "../types/types.ts";

const providerValues: AuthProvider[] = ["email", "google", "apple"];

export const exchangeSessionController = async (req: Request, res: Response) => {
  const {
    provider,
    providerUserId,
    userEmail,
    userName,
    emailVerified,
  } = req.body as {
    provider?: string;
    providerUserId?: string;
    userEmail?: string;
    userName?: string;
    emailVerified?: boolean;
  };

  if (
    !provider ||
    !providerValues.includes(provider as AuthProvider) ||
    !providerUserId ||
    !userEmail
  ) {
    return res.status(400).json({
      error:
        "provider (email|google|apple), providerUserId and userEmail are required",
    });
  }

  try {
    const session = await exchangeIdentityForSession({
      provider: provider as AuthProvider,
      providerUserId,
      userEmail,
      userName,
      emailVerified,
    });
    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not exchange identity" });
  }
};

export const refreshSessionController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }
  try {
    const session = await refreshSession(refreshToken);
    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Could not refresh session" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }
  try {
    await revokeSession(refreshToken);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not logout" });
  }
};

export const logoutAllController = async (_req: Request, res: Response) => {
  const userId = Number(res.locals.authUserId);
  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await revokeAllUserSessions(userId);
    return res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not logout all sessions" });
  }
};

export const meController = async (_req: Request, res: Response) => {
  const userId = Number(res.locals.authUserId);
  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not fetch current user" });
  }
};
