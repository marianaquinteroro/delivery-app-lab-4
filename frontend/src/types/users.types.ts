export type userRole = "consumer" | "store" | "delivery";

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  role: userRole;
}
