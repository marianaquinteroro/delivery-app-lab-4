import { Request, Response } from "express";
import { CreateStoreDTO } from "./stores.types";
import Boom from "@hapi/boom";
import { createStoreService, getStoresService } from "./stores.service";

export const getStoresController = async (_req: Request, res: Response) => {
  const stores = await getStoresService();
  if (stores.length < 0) {
    throw Boom.badRequest("No stores found");
  }
  res.status(200).json(stores);
};

export const createStoreController = async (
  store: CreateStoreDTO,
  res: Response,
) => {
  if (!store.name) {
    throw Boom.badRequest("Store Name is required");
  }

  const newStore = await createStoreService(store);
  res.status(201).json(newStore);
};
