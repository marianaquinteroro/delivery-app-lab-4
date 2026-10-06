import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Auth context must be in Auth Provider");
  }

  return authContext;
}
