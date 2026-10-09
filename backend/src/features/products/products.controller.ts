import { Request, Response } from "express";
import { createProductService } from "./products.service";
import Boom from "@hapi/boom";

export const createProductController = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { name, price } = req.body;

  if (!name) {
    throw Boom.badRequest("name is required");
  }
  if (price < 0) {
    throw Boom.badRequest("price must be a number greater or equal to 0");
  }

  const newProduct = await createProductService({
    name,
    price,
    storeId: String(storeId),
  });
  res.status(201).json(newProduct);
};
