"use client";

import { apiFetch } from "@/src/lib/api";
import {
  COURIER_STEP_DEGREES,
  LOCATION_THROTTLE_MS,
} from "@/src/lib/config";
import { distanceInMeters } from "@/src/lib/geo";
import { throttle } from "@/src/lib/throttle";
import { LatLng, Order } from "@/src/types/orders.types";
import { useEffect, useMemo, useRef, useState } from "react";

const MOVES: Record<string, LatLng> = {
  ArrowUp: { lat: COURIER_STEP_DEGREES, lng: 0 },
  ArrowDown: { lat: -COURIER_STEP_DEGREES, lng: 0 },
  ArrowLeft: { lat: 0, lng: -COURIER_STEP_DEGREES },
  ArrowRight: { lat: 0, lng: COURIER_STEP_DEGREES },
};

export const useCourierMovement = (initialOrder: Order) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [position, setPosition] = useState<LatLng>({
    lat: initialOrder.courier_lat ?? 0,
    lng: initialOrder.courier_lng ?? 0,
  });
  const positionRef = useRef(position);

  const destination: LatLng = {
    lat: initialOrder.delivery_lat ?? 0,
    lng: initialOrder.delivery_lng ?? 0,
  };
  const isDelivered = order.status === "delivered";

  const sendLocation = useMemo(
    () =>
      throttle(async (next: LatLng) => {
        try {
          const res = await apiFetch(`/orders/${initialOrder.id}/location`, {
            method: "PATCH",
            body: JSON.stringify(next),
          });
          if (!res.ok) return;
          const updated: Order = await res.json();
          setOrder(updated);
        } catch (error) {
          console.error("Error en el envio de la ubicacion del repartidor", error);
        }
      }, LOCATION_THROTTLE_MS),
    [initialOrder.id],
  );

  useEffect(() => {
    if (isDelivered) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const move = MOVES[event.key];
      if (!move) return;
      event.preventDefault();

      const next = {
        lat: positionRef.current.lat + move.lat,
        lng: positionRef.current.lng + move.lng,
      };
      positionRef.current = next;
      setPosition(next);
      sendLocation(next);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDelivered, sendLocation]);

  useEffect(() => {
    if (isDelivered) sendLocation.cancel();
    return () => sendLocation.cancel();
  }, [isDelivered, sendLocation]);

  return {
    order,
    position,
    destination,
    distance: distanceInMeters(position, destination),
    isDelivered,
  };
};
