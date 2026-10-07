import { pool } from "../../db/db";
import { CreateOrderDTO } from "./orders.types";

export const createOrderRepository = async (data: CreateOrderDTO) => {
  const orderResult = await pool.query(
    "INSERT INTO orders (client_id, store_id, status) VALUES ($1, $2, $3) RETURNING *",
    [data.user_id, data.store_id, "waiting_for_deliver"],
  );

  const order = orderResult.rows[0];

  const orderItems = [];

  for (const item of data.items) {
    const itemResult = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [order.id, item.product_id, item.quantity],
    );

    orderItems.push(itemResult.rows[0]);
  }

  return {
    ...order,
    order_items: orderItems,
  };
};
