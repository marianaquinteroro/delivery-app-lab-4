"use client";

import { apiFetch } from "@/src/lib/api";
import {
  CreateOrderDTO,
  LatLng,
  OrderItemDTO,
} from "@/src/types/orders.types";
import { useState } from "react";
import { useAuth } from "../useAuth";
import { Product, StoreDetail } from "@/src/types/stores.types";
import { useRouter } from "next/navigation";

export const useCreateOrder = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<LatLng | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

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
    const productQuantity = getQuantity(product.id);

    setOrderItems((prevOrderItems) => {
      const exists = prevOrderItems.some(
        (item) => item.product_id === product.id,
      );

      if (exists) {
        return prevOrderItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: productQuantity }
            : item,
        );
      }
      return [
        ...prevOrderItems,
        {
          product_id: product.id,
          name: product.name,
          quantity: productQuantity,
        },
      ];
    });
  };

  const handleCreateOrder = async (storeDetail: StoreDetail) => {
    if (!user || !deliveryLocation) return;

    const order: CreateOrderDTO = {
      user_id: user.id,
      store_id: storeDetail.store.id,
      items: orderItems,
      delivery_location: deliveryLocation,
    };

    setIsCreating(true);
    try {
      const res = await apiFetch("/orders/create-order", {
        method: "POST",
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        throw new Error("Error creating order");
      }

      const data = await res.json();
      router.push(`/client/orders/${data.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Couldn't create the order");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    orderItems,
    getQuantity,
    handleAddOrderItems,
    handleAddQuantity,
    handleDeleteQuantity,
    handleCreateOrder,
    deliveryLocation,
    setDeliveryLocation,
    isCreating,
  };
};
