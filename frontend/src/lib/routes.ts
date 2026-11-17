import { userRole } from "@/src/types/users.types";

export const HOME_BY_ROLE: Record<userRole, string> = {
  consumer: "/client",
  store: "/store-admin",
  delivery: "/delivery",
};
