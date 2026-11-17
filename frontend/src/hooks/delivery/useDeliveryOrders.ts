"use client";

import { apiFetch } from "@/src/lib/api";
import { Order } from "@/src/types/orders.types";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../useAuth";
import { useBroadcast } from "../useBroadcast";

export const useDeliveryOrders = () => {
  const { user } = useAuth();
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const [activeRes, availableRes] = await Promise.all([
        apiFetch("/orders/delivery/active"),
        apiFetch("/orders/available"),
      ]);
      if (!activeRes.ok || !availableRes.ok) {
        throw new Error("Couldn't get orders");
      }

      setActiveOrder(await activeRes.json());
      setAvailableOrders(await availableRes.json());
      setError(null);
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadOrders();
  }, [user, loadOrders]);

  useBroadcast("orders", {
    "order-created": (payload) => {
      const created = payload as Order;
      setAvailableOrders((prev) =>
        prev.some((o) => o.id === created.id) ? prev : [...prev, created],
      );
    },
    "order-status-updated": (payload) => {
      const updated = payload as Order;
      if (updated.status !== "waiting_for_delivery") {
        setAvailableOrders((prev) => prev.filter((o) => o.id !== updated.id));
      }
    },
  });

  const acceptOrder = async (orderId: string) => {
    setAcceptingId(orderId);
    try {
      const res = await apiFetch(`/orders/${orderId}/accept`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Couldn't accept the order");
      }

      setActiveOrder(data);
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Couldn't accept the order",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const finishDelivery = () => {
    setActiveOrder(null);
    loadOrders();
  };

  return {
    availableOrders,
    activeOrder,
    isLoading,
    error,
    acceptingId,
    acceptOrder,
    finishDelivery,
  };
};
