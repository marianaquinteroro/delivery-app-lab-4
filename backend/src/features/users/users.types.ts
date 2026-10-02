export type userRole = "consumer" | "store" | "delivery";

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  role: userRole;
}

export interface CreateUserDTO {
  name: string;
  role: userRole;
  email: string;
  password: string;
  store_name?: string | null;
}

export interface CreateStoreDTO {
  name: string;
  is_open: boolean;
}

// export interface UpdateUserDTO {
//   userName?: string;
//   age?: number;
//   email?: string;
// }
