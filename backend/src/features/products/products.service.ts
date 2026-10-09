import { CreateProductDTO } from "./products.type";
import { createProduct } from "./produtcs.repository";

export const createProductService = async (product: CreateProductDTO) => {
  return await createProduct(product);
};
