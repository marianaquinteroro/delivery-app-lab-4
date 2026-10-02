import { PoolClient } from "pg";
import { pool } from "../../db/db";
import { CreateUserDTO, User } from "./users.types";

export const getUsersRepository = async () => {
  const result = await pool.query<User[]>("SELECT * from users");
  return result.rows;
};

export const getUserByIdRepository = async (id: string) => {
  const result = await pool.query<User>("SELECT * from users WHERE id=$1", [
    id,
  ]);
  return result.rows;
};

export const createUserRepository = async (user: CreateUserDTO) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, role, email",
      [user.name, user.role, user.email, user.password],
    );
    console.log("CREATED USER:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error in createUserRepository:", error);
    throw error;
  }
};
