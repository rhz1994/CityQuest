const isDevelopment = process.env.NODE_ENV !== "production";

const readSecret = (name: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET") => {
  const value = process.env[name];
  if (!value && !isDevelopment) {
    throw new Error(`${name} must be set in production`);
  }
  return value ?? `dev-${name.toLowerCase()}-change-me`;
};

export const authConfig = {
  accessSecret: readSecret("JWT_ACCESS_SECRET"),
  refreshSecret: readSecret("JWT_REFRESH_SECRET"),
  accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? "900"),
  refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? "2592000"),
  adminUserIds: (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0),
  allowDevEmailAuth:
    isDevelopment && process.env.ALLOW_DEV_EMAIL_AUTH === "true",
  allowDevQuestSolve:
    isDevelopment && process.env.ALLOW_DEV_QUEST_SOLVE === "true",
};
