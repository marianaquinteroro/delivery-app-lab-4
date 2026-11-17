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
  await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
      ) THEN
        ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;
      END IF;
    END $$;
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
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES users(id),
      delivery_id UUID REFERENCES users(id),
      store_id UUID NOT NULL REFERENCES stores(id),
      status TEXT NOT NULL DEFAULT 'waiting_for_delivery',
      delivery_location GEOGRAPHY(POINT, 4326),
      courier_location GEOGRAPHY(POINT, 4326),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_location GEOGRAPHY(POINT, 4326);
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_location GEOGRAPHY(POINT, 4326);
    UPDATE public.orders SET status = 'waiting_for_delivery' WHERE status = 'waiting_for_deliver';
    CREATE INDEX IF NOT EXISTS orders_delivery_location_idx ON public.orders USING GIST (delivery_location);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      quantity NUMERIC NOT NULL CHECK (quantity > 0)
    );
  `);
};
