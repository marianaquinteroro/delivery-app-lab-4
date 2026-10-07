import Boom from "@hapi/boom";
import {
  createStoreRepository,
  getStoreByUserIdRepository,
  getStoreDetailRepository,
  getStoresRepository,
} from "./stores.repository";
import { CreateStoreDTO } from "./stores.types";

export const getStoresService = async () => {
  const stores = await getStoresRepository();
  const openStores = stores.filter((store) => store.is_open);
  return openStores;
};

export const getStoreByUserIdService = async (user_owner_id: string) => {
  const store = await getStoreByUserIdRepository(user_owner_id);
  if (!store) {
    throw Boom.badRequest("Store not found");
  }

  return store;
};

export const getStoreDetailService = async (store_id: string) => {
  return await getStoreDetailRepository(store_id);
};

export const createStoreService = async (store: CreateStoreDTO) => {
  return await createStoreRepository(store);
};
