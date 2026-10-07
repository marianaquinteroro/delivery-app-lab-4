import { Pool } from "pg";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../config/config";

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_open BOOLEAN NOT NULL,
    user_owner_id UUID NOT NULL UNIQUE,

    CONSTRAINT store_user
    FOREIGN KEY (user_owner_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE
    );

    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES users(id),
    delivery_id uuid REFERENCES users(id),
    store_id uuid NOT NULL REFERENCES stores(id),
    status text not null default 'waiting_for_delivery',
    created_at timestamptz not null default now()
      )
      `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    quantity numeric NOT NULL CHECK (quantity > 0)
  )
        `);
};
