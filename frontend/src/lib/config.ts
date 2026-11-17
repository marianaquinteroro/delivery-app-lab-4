export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const DEFAULT_MAP_CENTER = { lat: 3.3417, lng: -76.5306 };
export const DELIVERY_RADIUS_METERS = 10;
export const COURIER_STEP_DEGREES = 0.00008;
export const LOCATION_THROTTLE_MS = 1000;
