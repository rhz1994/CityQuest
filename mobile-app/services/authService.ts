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
  providerUserId?: string;
  providerAccessToken?: string;
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
  providerAccessToken: string;
}): Promise<AuthSession> => {
  return exchangeIdentity({
    provider: "google",
    providerAccessToken: input.providerAccessToken,
    userEmail: "",
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

export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const { readTokens, saveTokens, clearTokens } = await import(
    "../utilities/secureStorage"
  );
  const { accessToken, refreshToken } = await readTokens();
  if (!accessToken) {
    throw new Error("Not signed in");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  const firstResponse = await fetch(input, { ...init, headers });
  if (firstResponse.status !== 401 || !refreshToken) {
    return firstResponse;
  }

  try {
    const refreshed = await refreshAuthSession(refreshToken);
    await saveTokens(refreshed.accessToken, refreshed.refreshToken);
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);
    return fetch(input, { ...init, headers: retryHeaders });
  } catch {
    await clearTokens();
    throw new Error("Session expired");
  }
};
