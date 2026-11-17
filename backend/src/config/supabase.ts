import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SECRET_KEY, SUPABASE_URL } from "./config";

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, options);

export const createAuthClient = () =>
  createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, options);
