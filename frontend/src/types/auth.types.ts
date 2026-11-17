import { User } from "./users.types";

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}
