import { createStoreRepository } from "./stores.repository";
import { CreateStoreDTO } from "./stores.types";

export const createStoreService = async (store: CreateStoreDTO) => {
  return await createStoreRepository(store);
};
