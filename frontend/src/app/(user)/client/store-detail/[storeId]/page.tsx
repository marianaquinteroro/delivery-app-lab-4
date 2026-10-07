"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useStoreDetail } from "@/src/hooks/useStoreDetail";
import { CreateOderDTO, OrderItemDTO } from "@/src/types/orders.types";
import { Product } from "@/src/types/stores.types";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { storeDetail, isLoading, error } = useStoreDetail(storeId);
  const { user } = useAuth();

  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]);

  const handleAddQuantity = (productId: string) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] ?? 1) + 1,
    }));
  };

  const handleDeleteQuantity = (productId: string) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] ?? 1) - 1,
    }));
  };

  const getQuantity = (productId: string) => quantity[productId] ?? 1;

  const handleAddOrderItems = (product: Product) => {
    // console.log("Click");
    const quantity = getQuantity(product.id);

    setOrderItems((prevOrderItems) => {
      const exists = prevOrderItems.some(
        (item) => item.product_id === product.id,
      );

      if (exists) {
       return prevOrderItems.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity,
              }
            : item,
        );
      }
      return [
        ...prevOrderItems,
        {
          product_id: product.id,
          quantity,
        },
      ];
    });
  };

  const handleCreateOrder = () => {
    if (!user || !storeDetail) return;

    const order: CreateOderDTO = {
      user_id: user.id,
      store_id: storeDetail?.store.id,
      items: orderItems,
    };

    console.log(order);
  };

  if (error) {
    return (
      <section>
        <p>We had a problem getting the Store Information. Please try again.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <p>Loading Store Detail...</p>
      </section>
    );
  }

  return (
    <div>
      <h2>Store {storeDetail?.store.name}</h2>
      {storeDetail?.products.length === 0 ? (
        <p>This store have no products</p>
      ) : (
        <section>
          Store Products
          {storeDetail?.products.map((product) => (
            <article key={product.id}>
              <p>{product.name}</p>
              <p>${product.price}</p>
              <div>
                <button
                  onClick={() => handleDeleteQuantity(product.id)}
                  disabled={getQuantity(product.id) === 1}
                >
                  -
                </button>
                <p>{getQuantity(product.id)}</p>
                <button onClick={() => handleAddQuantity(product.id)}>+</button>
              </div>
              <button
                className="bg-red-500 disabled:bg-red-200"
                onClick={() => handleAddOrderItems(product)}
              >
                Add to order
              </button>
            </article>
          ))}
          <button
            className="bg-blue-500 disabled:bg-blue-100"
            onClick={handleCreateOrder}
            disabled={orderItems.length === 0}
          >
            Create Order
          </button>
        </section>
      )}
    </div>
  );
}
