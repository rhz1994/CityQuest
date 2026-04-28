import { database } from "../../database.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { User } from "../types/types.ts";

export const getUserByName = async (userName: string): Promise<User | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE userName = ?",
    [userName],
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const [rows] = await database.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const createUser = async (
  userName: string,
  userEmail: string,
): Promise<number> => {
  const providerUserId = `email:${userEmail.toLowerCase()}`;
  const [result] = await database.query<ResultSetHeader>(
    "INSERT INTO users (userName, userEmail, authProvider, authProviderUserId, emailVerifiedAt, lastLoginAt) VALUES (?, ?, 'email', ?, NOW(), NOW())",
    [userName, userEmail, providerUserId],
  );
  return result.insertId;
};

export const updateUser = async (
  userId: number,
  userName: string,
  userEmail: string,
): Promise<boolean> => {
  const [result] = await database.query<ResultSetHeader>(
    "UPDATE users SET userName = ?, userEmail = ? WHERE userId = ?",
    [userName, userEmail, userId],
  );
  return result.affectedRows > 0;
};
