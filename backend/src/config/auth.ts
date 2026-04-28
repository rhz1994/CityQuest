export const authConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me",
  accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? "900"),
  refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? "2592000"),
};
