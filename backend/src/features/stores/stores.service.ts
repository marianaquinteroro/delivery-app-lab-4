import {
  createStoreRepository,
  getStoresRepository,
} from "./stores.repository";
import { CreateStoreDTO } from "./stores.types";

export const getStoresService = async () => {
  return await getStoresRepository();
};

export const createStoreService = async (store: CreateStoreDTO) => {
  return await createStoreRepository(store);
};
