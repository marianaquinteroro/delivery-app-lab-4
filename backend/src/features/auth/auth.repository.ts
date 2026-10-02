import { pool } from "../../db/db";
import { LoginDTO } from "./auth.types";

export const loginRepository = async (credentials: LoginDTO) => {
  const results = await pool.query(
    `SELECT id, name, role, email FROM users WHERE email=$1 AND password=$2
        `,
    [credentials.email, credentials.password],
  );

  return results.rows[0];
};
