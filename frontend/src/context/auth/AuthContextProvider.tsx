/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/src/types/users.types";
import {
  clearSession,
  getStoredSession,
  storeSession,
} from "@/src/lib/session";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const session = getStoredSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (error) {
      console.error("Error getting session", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = useCallback((newUser: User, newToken: string) => {
    storeSession(newUser, newToken);
    setUser(newUser);
    setToken(newToken);
  }, []);

  const logOut = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, saveSession, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
