import { User } from "@/src/types/users.types";

export interface AuthContextDTO {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logOut: () => void;
}
