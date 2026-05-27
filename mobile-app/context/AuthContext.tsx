import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  exchangeEmailIdentity,
  exchangeGoogleIdentity,
  fetchCurrentUser,
  logoutSession,
  refreshAuthSession,
  type AuthUser,
} from "../services/authService";
import { clearTokens, readTokens, saveTokens } from "../utilities/secureStorage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithEmail: (input: { userEmail: string; userName?: string }) => Promise<void>;
  signInWithGoogle: (input: {
    googleSub: string;
    userEmail: string;
    userName?: string;
    emailVerified?: boolean;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await readTokens();
      if (!accessToken || !refreshToken) {
        setUser(null);
        return;
      }

      try {
        const me = await fetchCurrentUser(accessToken);
        setUser(me);
        return;
      } catch {
        const refreshed = await refreshAuthSession(refreshToken);
        await saveTokens(refreshed.accessToken, refreshed.refreshToken);
        const me = await fetchCurrentUser(refreshed.accessToken);
        setUser(me);
      }
    } catch {
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const signInWithEmail = useCallback(
    async (input: { userEmail: string; userName?: string }) => {
      const session = await exchangeEmailIdentity(input);
      await saveTokens(session.accessToken, session.refreshToken);
      setUser(session.user);
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { refreshToken } = await readTokens();
    if (refreshToken) {
      await logoutSession(refreshToken).catch(() => undefined);
    }
    await clearTokens();
    setUser(null);
  }, []);

  const signInWithGoogle = useCallback(
    async (input: {
      googleSub: string;
      userEmail: string;
      userName?: string;
      emailVerified?: boolean;
    }) => {
      const session = await exchangeGoogleIdentity(input);
      await saveTokens(session.accessToken, session.refreshToken);
      setUser(session.user);
    },
    [],
  );

  const value = useMemo(
    () => ({ user, isLoading, signInWithEmail, signInWithGoogle, signOut }),
    [user, isLoading, signInWithEmail, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
