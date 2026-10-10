"use client";

import { CreateOrderDTO, OrderItemDTO } from "@/src/types/orders.types";
import { useState } from "react";
import { useAuth } from "../useAuth";
import { Product, StoreDetail } from "@/src/types/stores.types";
import { useRouter } from "next/navigation";

export const useCreateOrder = () => {
  const { user } = useAuth();
  const router = useRouter();
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

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
          name: product.name,
          quantity,
        },
      ];
    });
  };

  const handleCreateOrder = async (storeDetail: StoreDetail) => {
    if (!user) return;

    const order: CreateOrderDTO = {
      user_id: user.id,
      store_id: storeDetail.store.id,
      items: orderItems,
    };

    try {
      const res = await fetch("http://localhost:8080/orders/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        throw new Error("Error creating order");
      }

      const data = await res.json();

      console.log("Order created:", data);

      alert("Order created. Ty <3")

      router.push("/client/orders");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return {
    orderItems,
    getQuantity,
    handleAddOrderItems,
    handleAddQuantity,
    handleDeleteQuantity,
    handleCreateOrder,
  };
};
