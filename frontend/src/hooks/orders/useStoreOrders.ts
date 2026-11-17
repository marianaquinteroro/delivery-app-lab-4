"use client";

import { apiFetch } from "@/src/lib/api";
import { Order } from "@/src/types/orders.types";
import { useEffect, useState } from "react";
import { useBroadcast } from "../useBroadcast";
import { useToast } from "../useToast";

export const useStoreOrders = (storeId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const getStoreOrders = async () => {
      try {
        const res = await apiFetch(`/orders/store/${storeId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Couldn't get store orders");
        setOrders(await res.json());
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(String(error));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    getStoreOrders();
    return () => controller.abort();
  }, [storeId]);

  useBroadcast(`stores:${storeId}`, {
    "order-created": (payload) => {
      const created = payload as Order;
      setOrders((prev) =>
        prev.some((o) => o.id === created.id) ? prev : [created, ...prev],
      );
    },
    "order-status-updated": (payload) => {
      const updated = payload as Order;
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

      if (updated.status === "delivered") {
        showToast(`Order #${updated.id.slice(0, 8)} was delivered`);
      }
    },
  });

  return { orders, isLoading, error, toast, hideToast };
};
