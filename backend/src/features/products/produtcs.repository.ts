import { pool } from "../../db/db";
import { CreateProductDTO, UpdateProductDTO } from "./products.type";

export const createProduct = async (product: CreateProductDTO) => {
  const result = await pool.query(
    `
        INSERT INTO products (name, price, store_id) VALUES ($1, $2, $3) RETURNING *
        `,
    [product.name, product.price, product.storeId],
  );

  return result.rows[0];
};

export const updateProductRepository = async (product: UpdateProductDTO) => {
  const result = await pool.query(
    `
    UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *
    `,
    [product.name, product.price, product.id],
  );

  return result.rows[0];
};
