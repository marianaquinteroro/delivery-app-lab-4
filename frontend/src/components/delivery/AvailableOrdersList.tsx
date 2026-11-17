"use client";

import { Order } from "@/src/types/orders.types";
import { Button } from "../ui/Button";
import { OrderStatusBadge } from "../ui/OrderStatusBadge";

export const AvailableOrdersList = ({
  orders,
  acceptingId,
  onAccept,
}: {
  orders: Order[];
  acceptingId: string | null;
  onAccept: (orderId: string) => void;
}) => {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-2xl font-medium">Available orders</p>
      {orders.length === 0 ? (
        <p>
          No orders waiting for a courier. New ones will appear here
          automatically.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-900 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xl">{order.store_name}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
              <Button
                onClick={() => onAccept(order.id)}
                disabled={acceptingId !== null}
              >
                {acceptingId === order.id ? "Accepting..." : "Accept order"}
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
