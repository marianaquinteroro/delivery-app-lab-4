export interface Store {
  id: string;
  name: string;
  is_open: boolean;
  user_owner_id: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  store_id: string;
}

export interface StoreDetail {
  store: Store;
  products: Product[];
}

