export type userRole = "consumer" | "store" | "delivery";

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  role: userRole;
}

export interface CreateUserDTO {
  id: string;
  name: string;
  role: userRole;
  email: string;
  store_name?: string | null;
}

export interface CreateStoreDTO {
  name: string;
  is_open: boolean;
}
