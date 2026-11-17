import { User } from "@/src/types/users.types";

export interface AuthContextDTO {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  saveSession: (user: User, token: string) => void;
  logOut: () => void;
}
