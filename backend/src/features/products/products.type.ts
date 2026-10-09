export interface CreateProductDTO {
  storeId: string;
  name: string;
  price: number;
}

export interface UpdateProductDTO {
  id: string;
  name: string;
  price: number;
}
