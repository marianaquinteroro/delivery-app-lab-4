import { Request, Response } from "express";
import {
  createOrderService,
  getOrderByClientIdService,
} from "./orders.service";

export const getOrdersByClientIdController = async (
  req: Request,
  res: Response,
) => {
  const { clientId } = req.params;
  const orders = await getOrderByClientIdService(String(clientId));
  res.status(201).json(orders);
};

export const createOrderController = async (req: Request, res: Response) => {
  const order = await createOrderService(req.body);
  res.status(201).json(order);
};
