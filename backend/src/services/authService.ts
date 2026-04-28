import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { database } from "../../database.ts";
import { authConfig } from "../config/auth.ts";
import type { AuthProvider, User } from "../types/types.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface RefreshTokenRecord extends RowDataPacket {
  tokenId: number;
  userId: number;
  tokenHash: string;
  expiresAt: string;
  revokedAt: string | null;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const hashToken = (value: string): string =>
  crypto.createHash("sha256").update(value).digest("hex");

const parseExpiryFromToken = (token: string): Date => {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) {
    throw new Error("Missing refresh token expiry");
  }
  return new Date(decoded.exp * 1000);
};

const signTokens = (userId: number): TokenPair => {
  const accessToken = jwt.sign(
    { type: "access" },
    authConfig.accessSecret,
    {
      subject: String(userId),
      expiresIn: authConfig.accessTtlSeconds,
    },
  );

  const refreshToken = jwt.sign(
    { type: "refresh" },
    authConfig.refreshSecret,
    {
      subject: String(userId),
      expiresIn: authConfig.refreshTtlSeconds,
    },
  );

  return { accessToken, refreshToken };
};

const persistRefreshToken = async (
  userId: number,
  refreshToken: string,
): Promise<void> => {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = parseExpiryFromToken(refreshToken);

  await database.query<ResultSetHeader>(
    "INSERT INTO refreshTokens (userId, tokenHash, expiresAt) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt],
  );
};

const revokeRefreshTokenByHash = async (tokenHash: string): Promise<void> => {
  await database.query<ResultSetHeader>(
    "UPDATE refreshTokens SET revokedAt = NOW() WHERE tokenHash = ? AND revokedAt IS NULL",
    [tokenHash],
  );
};

const mapUser = (row: RowDataPacket): User => ({
  userId: row.userId,
  userName: row.userName,
  userEmail: row.userEmail,
  authProvider: row.authProvider,
  authProviderUserId: row.authProviderUserId,
  emailVerifiedAt: row.emailVerifiedAt,
  lastLoginAt: row.lastLoginAt,
});

export const exchangeIdentityForSession = async (input: {
  provider: AuthProvider;
  providerUserId: string;
  userEmail: string;
  userName?: string;
  emailVerified?: boolean;
}): Promise<TokenPair & { user: User }> => {
  // NOTE: In production, verify provider token with Supabase/Auth provider before exchange.
  const { provider, providerUserId, userEmail, emailVerified } = input;
  const fallbackName = userEmail.split("@")[0]?.slice(0, 40) || "player";
  const userName = (input.userName?.trim() || fallbackName).slice(0, 100);

  const [providerRows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE authProvider = ? AND authProviderUserId = ? LIMIT 1",
    [provider, providerUserId],
  );

  let user: User | null = null;

  if (providerRows.length > 0) {
    await database.query<ResultSetHeader>(
      "UPDATE users SET userName = ?, userEmail = ?, lastLoginAt = NOW() WHERE userId = ?",
      [userName, userEmail, providerRows[0].userId],
    );
    user = mapUser({ ...providerRows[0], userName, userEmail, lastLoginAt: new Date().toISOString() });
  } else {
    const [emailRows] = await database.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE userEmail = ? LIMIT 1",
      [userEmail],
    );

    if (emailRows.length > 0) {
      await database.query<ResultSetHeader>(
        "UPDATE users SET authProvider = ?, authProviderUserId = ?, userName = ?, emailVerifiedAt = CASE WHEN ? THEN NOW() ELSE emailVerifiedAt END, lastLoginAt = NOW() WHERE userId = ?",
        [provider, providerUserId, userName, Boolean(emailVerified), emailRows[0].userId],
      );
      user = mapUser({
        ...emailRows[0],
        authProvider: provider,
        authProviderUserId: providerUserId,
        userName,
        emailVerifiedAt: emailVerified ? new Date().toISOString() : emailRows[0].emailVerifiedAt,
        lastLoginAt: new Date().toISOString(),
      });
    } else {
      const [insertResult] = await database.query<ResultSetHeader>(
        "INSERT INTO users (userName, userEmail, authProvider, authProviderUserId, emailVerifiedAt, lastLoginAt) VALUES (?, ?, ?, ?, ?, NOW())",
        [userName, userEmail, provider, providerUserId, emailVerified ? new Date() : null],
      );
      const [createdRows] = await database.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE userId = ? LIMIT 1",
        [insertResult.insertId],
      );
      user = mapUser(createdRows[0]);
    }
  }

  if (!user) throw new Error("Could not upsert user");

  const tokens = signTokens(user.userId);
  await persistRefreshToken(user.userId, tokens.refreshToken);

  return { ...tokens, user };
};

export const refreshSession = async (
  refreshToken: string,
): Promise<TokenPair & { userId: number }> => {
  const decoded = jwt.verify(refreshToken, authConfig.refreshSecret) as {
    sub?: string;
    type?: "refresh";
  };

  if (decoded.type !== "refresh" || !decoded.sub) {
    throw new Error("Invalid refresh token");
  }

  const userId = Number(decoded.sub);
  if (!Number.isFinite(userId) || userId <= 0) {
    throw new Error("Invalid refresh token subject");
  }

  const tokenHash = hashToken(refreshToken);
  const [rows] = await database.query<RefreshTokenRecord[]>(
    "SELECT * FROM refreshTokens WHERE tokenHash = ? LIMIT 1",
    [tokenHash],
  );
  const tokenRow = rows[0];

  if (!tokenRow || tokenRow.userId !== userId || tokenRow.revokedAt) {
    throw new Error("Refresh token revoked or not found");
  }

  await revokeRefreshTokenByHash(tokenHash);

  const nextTokens = signTokens(userId);
  await persistRefreshToken(userId, nextTokens.refreshToken);

  return { ...nextTokens, userId };
};

export const revokeSession = async (refreshToken: string): Promise<void> => {
  const tokenHash = hashToken(refreshToken);
  await revokeRefreshTokenByHash(tokenHash);
};

export const revokeAllUserSessions = async (userId: number): Promise<void> => {
  await database.query<ResultSetHeader>(
    "UPDATE refreshTokens SET revokedAt = NOW() WHERE userId = ? AND revokedAt IS NULL",
    [userId],
  );
};
