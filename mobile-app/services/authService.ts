import API_URL from "../config/api";

export interface AuthUser {
  userId: number;
  userName: string;
  userEmail: string;
  authProvider: "email" | "google" | "apple";
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type IdentityProvider = "email" | "google" | "apple";

const parseJsonOrThrow = async (res: Response) => {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : "Authentication request failed";
    throw new Error(message);
  }
  return payload;
};

const exchangeIdentity = async (input: {
  provider: IdentityProvider;
  providerUserId: string;
  userEmail: string;
  userName?: string;
  emailVerified?: boolean;
}): Promise<AuthSession> => {
  const res = await fetch(`${API_URL}/auth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return (await parseJsonOrThrow(res)) as AuthSession;
};

export const exchangeEmailIdentity = async (input: {
  userEmail: string;
  userName?: string;
}): Promise<AuthSession> => {
  const normalizedEmail = input.userEmail.trim().toLowerCase();
  return exchangeIdentity({
    provider: "email",
    providerUserId: `email:${normalizedEmail}`,
    userEmail: normalizedEmail,
    userName: input.userName,
    emailVerified: true,
  });
};

export const exchangeGoogleIdentity = async (input: {
  googleSub: string;
  userEmail: string;
  userName?: string;
  emailVerified?: boolean;
}): Promise<AuthSession> => {
  return exchangeIdentity({
    provider: "google",
    providerUserId: input.googleSub,
    userEmail: input.userEmail.trim().toLowerCase(),
    userName: input.userName,
    emailVerified: input.emailVerified ?? false,
  });
};

export const refreshAuthSession = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; userId: number }> => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return (await parseJsonOrThrow(res)) as {
    accessToken: string;
    refreshToken: string;
    userId: number;
  };
};

export const fetchCurrentUser = async (accessToken: string): Promise<AuthUser> => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return (await parseJsonOrThrow(res)) as AuthUser;
};

export const logoutSession = async (refreshToken: string): Promise<void> => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
};
