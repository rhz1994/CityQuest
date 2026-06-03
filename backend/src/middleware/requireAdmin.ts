import type { NextFunction, Request, Response } from "express";
import { authConfig } from "../config/auth.ts";

export const requireAdmin = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(res.locals.authUserId);
  if (!Number.isFinite(userId) || userId <= 0) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!authConfig.adminUserIds.includes(userId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
};
