export type UserRole = "consumer" | "store" | "delivery";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  store_name?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
