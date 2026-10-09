import { Request, Response } from "express";
import { createProductService, updateProductService } from "./products.service";
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

export const updateProductController = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, price } = req.body;

  if (!name) {
    throw Boom.badRequest("name is required");
  }
  if (price < 0) {
    throw Boom.badRequest("price must be a number greater or equal to 0");
  }

  const product = await updateProductService({
    id: String(productId),
    name,
    price,
  });

  res.status(200).json(product);
};
