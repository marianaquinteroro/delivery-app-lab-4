"use client";

import { apiFetch } from "@/src/lib/api";
import { Order } from "@/src/types/orders.types";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { useBroadcast } from "../useBroadcast";
import { useToast } from "../useToast";

export const useClientOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();

    const getOrdersByClientId = async () => {
      try {
        const res = await apiFetch(`/orders/${user.id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Couldn't get orders");
        }

        const data: Order[] = await res.json();
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
  }, [user]);

  useBroadcast(user ? `clients:${user.id}` : null, {
    "order-status-updated": (payload) => {
      const updated = payload as Order;
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order)),
      );

      if (updated.status === "delivered") {
        showToast(`Your order from ${updated.store_name} has been delivered!`);
      }
    },
  });

  return {
    orders,
    isLoading,
    error,
    toast,
    hideToast,
  };
};
