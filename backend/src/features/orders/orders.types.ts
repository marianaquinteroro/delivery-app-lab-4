export type OrderStatus = "waiting_for_delivery" | "in_progress" | "delivered";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
}

export interface CreateOrderDTO {
  user_id: string;
  store_id: string;
  items: CreateOrderItemDTO[];
  delivery_location: LatLng;
}

export interface Order {
  id: string;
  client_id: string;
  delivery_id: string | null;
  store_id: string;
  store_name: string;
  status: OrderStatus;
  created_at: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  courier_lat: number | null;
  courier_lng: number | null;
}

export interface LocationUpdatedPayload {
  orderId: string;
  lat: number;
  lng: number;
  status: OrderStatus;
}
