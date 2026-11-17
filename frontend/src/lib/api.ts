import { API_URL } from "./config";
import { clearSession, getToken } from "./session";

export const apiFetch = async (path: string, init: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && token) {
    clearSession();
    window.location.href = "/login";
  }

  return res;
};
