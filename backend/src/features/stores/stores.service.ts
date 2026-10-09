import Boom from "@hapi/boom";
import {
  createStoreRepository,
  getStoreByUserIdRepository,
  getStoreDetailRepository,
  getStoresRepository,
  updateStoreStatusRepository,
} from "./stores.repository";
import { CreateStoreDTO } from "./stores.types";

export const getStoresService = async () => {
  const stores = await getStoresRepository();
  const openStores = stores.filter((store) => store.is_open);
  return openStores;
};

export const getStoreByUserIdService = async (userOwnerId: string) => {
  const store = await getStoreByUserIdRepository(userOwnerId);
  if (!store) {
    throw Boom.badRequest("Store not found");
  }

  return store;
};

export const updateStoreStatusService = async (
  storeId: string,
  userId: string,
  isOpen: boolean,
) => {
  return await updateStoreStatusRepository(storeId, userId, isOpen);
};

export const getStoreDetailService = async (store_id: string) => {
  return await getStoreDetailRepository(store_id);
};

export const createStoreService = async (store: CreateStoreDTO) => {
  return await createStoreRepository(store);
};
