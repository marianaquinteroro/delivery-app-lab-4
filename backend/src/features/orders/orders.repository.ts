import { pool } from "../../db/db";
import { CreateOrderDTO, LatLng, Order, OrderStatus } from "./orders.types";

const ORDER_SELECT = `
  SELECT
    o.id, o.client_id, o.delivery_id, o.store_id, s.name AS store_name,
    o.status, o.created_at,
    ST_Y(o.delivery_location::geometry) AS delivery_lat,
    ST_X(o.delivery_location::geometry) AS delivery_lng,
    ST_Y(o.courier_location::geometry)  AS courier_lat,
    ST_X(o.courier_location::geometry)  AS courier_lng
  FROM public.orders o
  JOIN public.stores s ON s.id = o.store_id
`;

export const getOrderByIdRepository = async (orderId: string) => {
  const result = await pool.query<Order>(`${ORDER_SELECT} WHERE o.id = $1`, [
    orderId,
  ]);
  return result.rows[0];
};

export const getOrderByClientId = async (clientId: string) => {
  const result = await pool.query<Order>(
    `${ORDER_SELECT} WHERE o.client_id = $1 ORDER BY o.created_at DESC`,
    [clientId],
  );
  return result.rows;
};

export const getOrdersByStoreIdRepository = async (storeId: string) => {
  const result = await pool.query<Order>(
    `${ORDER_SELECT} WHERE o.store_id = $1 ORDER BY o.created_at DESC`,
    [storeId],
  );
  return result.rows;
};

export const getAvailableOrdersRepository = async () => {
  const result = await pool.query<Order>(
    `${ORDER_SELECT}
     WHERE o.status = 'waiting_for_delivery'
       AND o.delivery_id IS NULL
       AND o.delivery_location IS NOT NULL
     ORDER BY o.created_at ASC`,
  );
  return result.rows;
};

export const getActiveOrderByDeliveryIdRepository = async (
  deliveryId: string,
) => {
  const result = await pool.query<Order>(
    `${ORDER_SELECT} WHERE o.delivery_id = $1 AND o.status = 'in_progress' LIMIT 1`,
    [deliveryId],
  );
  return result.rows[0];
};

export const getStoreOwnerIdRepository = async (storeId: string) => {
  const result = await pool.query<{ user_owner_id: string }>(
    "SELECT user_owner_id FROM public.stores WHERE id = $1",
    [storeId],
  );
  return result.rows[0]?.user_owner_id;
};

export const createOrderRepository = async (data: CreateOrderDTO) => {
  const orderResult = await pool.query<{ id: string }>(
    `INSERT INTO public.orders (client_id, store_id, status, delivery_location)
     VALUES ($1, $2, 'waiting_for_delivery',
             ST_SetSRID(ST_MakePoint($3::float8, $4::float8), 4326)::geography)
     RETURNING id`,
    [
      data.user_id,
      data.store_id,
      data.delivery_location.lng,
      data.delivery_location.lat,
    ],
  );

  const orderId = orderResult.rows[0].id;
  const orderItems = [];

  for (const item of data.items) {
    const itemResult = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [orderId, item.product_id, item.quantity],
    );
    orderItems.push(itemResult.rows[0]);
  }

  return { orderId, orderItems };
};

export const acceptOrderRepository = async (
  orderId: string,
  deliveryId: string,
  offsetDegrees: number,
) => {
  const result = await pool.query<{ id: string }>(
    `UPDATE public.orders
     SET delivery_id = $2,
         status = 'in_progress',
         courier_location = ST_SetSRID(ST_MakePoint(
           ST_X(delivery_location::geometry) + $3::float8,
           ST_Y(delivery_location::geometry) + $3::float8
         ), 4326)::geography
     WHERE id = $1
       AND status = 'waiting_for_delivery'
       AND delivery_id IS NULL
       AND delivery_location IS NOT NULL
     RETURNING id`,
    [orderId, deliveryId, offsetDegrees],
  );
  return result.rows[0];
};

export const updateCourierLocationRepository = async (
  orderId: string,
  deliveryId: string,
  { lat, lng }: LatLng,
  radiusMeters: number,
) => {
  const result = await pool.query<{ id: string; status: OrderStatus }>(
    `UPDATE public.orders
     SET courier_location = ST_SetSRID(ST_MakePoint($3::float8, $4::float8), 4326)::geography,
         status = CASE
           WHEN ST_DWithin(
             ST_SetSRID(ST_MakePoint($3::float8, $4::float8), 4326)::geography,
             delivery_location,
             $5::float8
           ) THEN 'delivered'
           ELSE status
         END
     WHERE id = $1 AND delivery_id = $2 AND status = 'in_progress'
     RETURNING id, status`,
    [orderId, deliveryId, lng, lat, radiusMeters],
  );
  return result.rows[0];
};
