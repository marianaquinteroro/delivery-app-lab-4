import { pool } from "../../db/db";
import { CreateUserDTO, User } from "./users.types";

export const getUsersRepository = async () => {
  const result = await pool.query<User[]>(
    "SELECT id, name, role, email from users",
  );
  return result.rows;
};

export const getUserByIdRepository = async (id: string) => {
  const result = await pool.query<User>(
    "SELECT id, name, role, email from users WHERE id=$1",
    [id],
  );
  return result.rows;
};

export const createUserRepository = async (user: CreateUserDTO) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (id, name, role, email) VALUES ($1, $2, $3, $4) RETURNING id, name, role, email",
      [user.id, user.name, user.role, user.email],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in createUserRepository:", error);
    throw error;
  }
};
