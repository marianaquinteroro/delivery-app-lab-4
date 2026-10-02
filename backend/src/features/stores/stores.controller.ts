import { Response } from "express";
import { CreateStoreDTO } from "./stores.types";
import Boom from "@hapi/boom";
import { createStoreService } from "./stores.service";

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
