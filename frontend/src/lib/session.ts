import { User } from "@/src/types/users.types";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getStoredSession = (): { user: User; token: string } | null => {
  if (typeof window === "undefined") return null;
  const user = sessionStorage.getItem(USER_KEY);
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!user || !token) return null;
  return { user: JSON.parse(user), token };
};

export const storeSession = (user: User, token: string) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};
