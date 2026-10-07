export interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
}

export interface CreateOrderDTO {
  user_id: string;
  store_id: string;
  items: CreateOrderItemDTO[];
}
