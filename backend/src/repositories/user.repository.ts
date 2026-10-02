import { pool } from "../db/db";
import Boom from "@hapi/boom";
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO, User } from "../features/users/users.types";

export const getUserByIdRepository = async (id: string): Promise<User> => {
  const result = await pool.query<User>(
    'SELECT id, name AS "userName", age, email FROM users WHERE id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw Boom.notFound("User not found");
  }

  return result.rows[0];
};

export const getUsersRepository = async (
  _filters: GetUsersDTO,
): Promise<User[]> => {
  const result = await pool.query<User>(
    'SELECT id, name AS "userName", age, email FROM users',
  );
  return result.rows;
};

export const createUserRepository = async (
  user: CreateUserDTO,
): Promise<User> => {
  const result = await pool.query<User>(
    `
    INSERT INTO users (name, age, email) VALUES ($1, $2, $3)
    RETURNING id, name AS "userName", age, email
    `,
    [user.userName, user.age, user.email],
  );

  if (result.rowCount === 0) {
    throw Boom.badRequest("User cannot be created");
  }

  return result.rows[0];
};

export const updateUserRepository = async (
  id: string,
  user: UpdateUserDTO,
): Promise<User> => {
  await pool.query<User>(
    `
    UPDATE users
    SET
      name = COALESCE($2, name),
      age = COALESCE($3, age),
      email = COALESCE($4, email)
    WHERE id = $1`,
    [id, user.userName, user.age, user.email],
  );

  return getUserByIdRepository(id);
};

export const deleteUserRepository = async (id: string): Promise<void> => {
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
};
