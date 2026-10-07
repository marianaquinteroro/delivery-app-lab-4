import { createOrderRepository } from "./orders.repository";
import { CreateOrderDTO } from "./orders.types";

export const createOrderService = async (data: CreateOrderDTO) => {
  return await createOrderRepository(data);
};
