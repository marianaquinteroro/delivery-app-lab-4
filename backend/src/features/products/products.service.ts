import { CreateProductDTO, UpdateProductDTO } from "./products.type";
import { createProduct, updateProductRepository } from "./produtcs.repository";

export const createProductService = async (product: CreateProductDTO) => {
  return await createProduct(product);
};

export const updateProductService = async (product: UpdateProductDTO) => {
  return await updateProductRepository(product);
};
