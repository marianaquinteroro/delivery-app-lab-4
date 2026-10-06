import { User } from "./users.types";

export interface LoginResponse {
  user: User;
  error?: string;
}
