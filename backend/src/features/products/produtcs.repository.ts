import { pool } from "../../db/db";
import { CreateProductDTO } from "./products.type";

export const createProduct = async (product: CreateProductDTO) => {
  const result = await pool.query(
    `
        INSERT INTO products (name, price, store_id) VALUES ($1, $2, $3) RETURNING *
        `,
    [product.name, product.price, product.storeId],
  );

  return result.rows[0];
};
