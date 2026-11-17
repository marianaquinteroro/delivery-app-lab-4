"use client";

import { apiFetch } from "@/src/lib/api";
import { LocationUpdatedPayload, Order } from "@/src/types/orders.types";
import { useEffect, useState } from "react";
import { useBroadcast } from "../useBroadcast";
import { useToast } from "../useToast";

export const useOrderTracking = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const getOrder = async () => {
      try {
        const res = await apiFetch(`/orders/detail/${orderId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Couldn't get the order");
        setOrder(await res.json());
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(String(error));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    getOrder();
    return () => controller.abort();
  }, [orderId]);

  useBroadcast(`orders:${orderId}`, {
    "location-updated": (payload) => {
      const { lat, lng } = payload as LocationUpdatedPayload;
      setOrder(
        (prev) => prev && { ...prev, courier_lat: lat, courier_lng: lng },
      );
    },
    "order-status-updated": (payload) => {
      const updated = payload as Order;
      setOrder(updated);

      if (updated.status === "delivered") {
        showToast(
          "Your order has arrived! The courier is less than 10 m away.",
        );
      }
    },
  });

  return { order, isLoading, error, toast, hideToast };
};
