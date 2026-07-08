import { rateLimit } from "express-rate-limit";

const readPositiveInteger = (name: string, fallback: number): number => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

export const authRateLimiter = rateLimit({
  windowMs: readPositiveInteger("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  limit: readPositiveInteger("AUTH_RATE_LIMIT_MAX_REQUESTS", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication requests. Try again later.",
  },
});

export const puzzleSolveRateLimiter = rateLimit({
  windowMs: readPositiveInteger(
    "PUZZLE_SOLVE_RATE_LIMIT_WINDOW_MS",
    10 * 60 * 1000,
  ),
  limit: readPositiveInteger("PUZZLE_SOLVE_RATE_LIMIT_MAX_REQUESTS", 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many puzzle solve attempts. Try again later.",
  },
});
