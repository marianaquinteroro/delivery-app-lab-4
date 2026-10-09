import { pool } from "../../db/db";
import { CreateStoreDTO, Product, Store, StoreDetial } from "./stores.types";

export const getStoresRepository = async () => {
  const result = await pool.query<Store>("SELECT * from stores");
  return result.rows;
};

export const getStoreByUserIdRepository = async (userOwnerId: string) => {
  const resultStore = await pool.query<Store>(
    "SELECT * from stores WHERE user_owner_id=$1",
    [userOwnerId],
  );

  const storeProductsResult = await pool.query<Product>(
    "SELECT * from products WHERE store_id=$1",
    [resultStore.rows[0].id],
  );

  const storeDetial: StoreDetial = {
    store: resultStore.rows[0],
    products: storeProductsResult.rows,
  };

  return storeDetial;
};

export const updateStoreStatusRepository = async (
  storeId: string,
  userId: string,
  isOpen: boolean,
) => {
  const result = await pool.query(
    `
    UPDATE stores SET is_open = $1
    WHERE id = $2 AND user_owner_id = $3
    RETURNING *
    `,
    [isOpen, storeId, userId],
  );

  return result.rows[0];
};

export const getStoreDetailRepository = async (id: string) => {
  const resultStore = await pool.query<Store>(
    "SELECT * from stores WHERE id=$1",
    [id],
  );

  const storeProductsResult = await pool.query<Product>(
    "SELECT * from products WHERE store_id=$1",
    [resultStore.rows[0].id],
  );

  const storeDetial: StoreDetial = {
    store: resultStore.rows[0],
    products: storeProductsResult.rows,
  };

  return storeDetial;
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
