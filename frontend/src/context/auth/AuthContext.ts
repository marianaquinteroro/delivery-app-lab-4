import { createContext } from "react";
import { AuthContextDTO } from "./auth.types";

export const AuthContext = createContext<AuthContextDTO| null>(null);
