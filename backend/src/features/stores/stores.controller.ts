import { Request, Response } from "express";
import { CreateStoreDTO } from "./stores.types";
import Boom from "@hapi/boom";
import {
  createStoreService,
  getStoreByUserIdService,
  getStoreDetailService,
  getStoresService,
  updateStoreStatusService,
} from "./stores.service";

export const getStoresController = async (_req: Request, res: Response) => {
  const stores = await getStoresService();
  if (stores.length === 0) {
    throw Boom.badRequest("No stores found");
  }
  res.status(200).json(stores);
};

export const getStoreByUserIdController = async (
  req: Request,
  res: Response,
) => {
  const { userOwnerId } = req.params;
  const store = await getStoreByUserIdService(String(userOwnerId));
  res.status(200).json(store);
};

export const getStoreDetailController = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const storeDetail = await getStoreDetailService(String(storeId));
  if (!storeDetail) throw Boom.notFound("Store not found");
  res.status(200).json(storeDetail);
};

export const updateStoreStatusController = async (
  req: Request,
  res: Response,
) => {
  const { storeId } = req.params;
  const { isOpen, userId } = req.body;


  if (typeof userId !== "string" || typeof isOpen !== "boolean") {
    throw Boom.badRequest("userId and isOpen are required");
  }

  const store = await updateStoreStatusService(
    String(storeId),
    String(userId),
    isOpen,
  );

  if (!store) {
    throw Boom.notFound("Store not found");
  }

  res.status(200).json(store);
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
