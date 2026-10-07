"use client";

import { OrderByClient } from "@/src/types/orders.types";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";

export const useClientOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderByClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getOrdersByClientId = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders/${user?.id}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          throw new Error("Store not found");
        }
        if (!res.ok) {
          throw new Error("Couldn't get Store");
        }

        const data: OrderByClient[] = await res.json();
        console.log(data);

        setOrders(data);
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setError(String(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getOrdersByClientId();

    return () => controller.abort();
  }, [user?.id]);

  return {
    orders,
    isLoading,
    error,
  };
};
