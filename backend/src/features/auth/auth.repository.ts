import { pool } from "../../db/db";
import { AuthUser } from "./auth.types";

export const getUserProfileByIdRepository = async (id: string) => {
  const result = await pool.query<AuthUser>(
    "SELECT id, name, role, email FROM public.users WHERE id = $1",
    [id],
  );

  return result.rows[0];
};
