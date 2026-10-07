export type OrderStatus = "“waiting_for_deliver" | "in_progress" | "delivered";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
}

export interface OrderByClient {
  id: string;
  client_id: string;
  delivery_id: string | null;
  store_id: string;
  status: string;
  created_at: string;
}

export interface OrderItemDTO {
  product_id: string;
  quantity: number;
}

export interface CreateOderDTO {
  user_id: string;
  store_id: string;
  items: OrderItemDTO[];
}

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  delivery_id: string | null;
  status: OrderStatus;
  order_items: OrderItem[];
  create_at: string;
}
