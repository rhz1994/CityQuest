import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { authConfig } from "../config/auth.ts";

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  type: "access";
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, authConfig.accessSecret) as AccessTokenPayload;

    if (decoded.type !== "access" || !decoded.sub) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    const userId = Number(decoded.sub);
    if (!Number.isFinite(userId) || userId <= 0) {
      return res.status(401).json({ error: "Invalid access token subject" });
    }

    res.locals.authUserId = userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
