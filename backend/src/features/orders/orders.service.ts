import { createOrderRepository, getOrderByClientId } from "./orders.repository";
import { CreateOrderDTO } from "./orders.types";

export const getOrderByClientIdService = async (clientId: string) => {
  return await getOrderByClientId(clientId);
};

export const createOrderService = async (data: CreateOrderDTO) => {
  return await createOrderRepository(data);
};
