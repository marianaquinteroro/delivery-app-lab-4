import { Request, Response } from "express";
import { createOrderService } from "./orders.service";

export const createOrderController = async (req: Request, res: Response) => {
  console.log(req.body);

  const order = await createOrderService(req.body);

  res.status(201).json(order);
};
