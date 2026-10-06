import { pool } from "../../db/db";
import { CreateStoreDTO, Store } from "./stores.types";

export const getStoresRepository = async () => {
  const result = await pool.query<Store[]>("SELECT * from stores");
  return result.rows;
};

export const createStoreRepository = async (store: CreateStoreDTO) => {
  try {
    const result = await pool.query(
      "INSERT INTO stores (name, is_open, user_owner_id) VALUES ($1, $2, $3) RETURNING *",
      [store.name, false, store.user_owner_id],
    );
    console.log("CREATED STORE", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error in createStoreRepository:", error);
    throw error;
  }
};
