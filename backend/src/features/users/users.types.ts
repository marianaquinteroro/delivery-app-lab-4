export type userRole = "consumer" | "store" | "delivery";

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  role: userRole;
  storeName?: string | null;
}

export interface CreateUserDTO {
  name: string;
  role: userRole;
  email: string;
  store_name?: string | null;
}

// export interface UpdateUserDTO {
//   userName?: string;
//   age?: number;
//   email?: string;
// }
