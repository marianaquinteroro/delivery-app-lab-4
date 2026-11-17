"use client";

import { useCourierMovement } from "@/src/hooks/delivery/useCourierMovement";
import { Order } from "@/src/types/orders.types";
import { DeliveryMap } from "../map/DeliveryMap";
import { Button } from "../ui/Button";
import { OrderStatusBadge } from "../ui/OrderStatusBadge";

export const ActiveDelivery = ({
  order: initialOrder,
  onFinish,
}: {
  order: Order;
  onFinish: () => void;
}) => {
  const { order, position, destination, distance, isDelivered } =
    useCourierMovement(initialOrder);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-medium">
          Delivering order from {order.store_name}
        </h3>
        <OrderStatusBadge status={order.status} />
      </div>

      {isDelivered ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-green-300 bg-green-100 p-4 text-green-800">
          <p className="font-medium">
            Order delivered! You reached the destination.
          </p>
          <div>
            <Button onClick={onFinish}>Back to available orders</Button>
          </div>
        </div>
      ) : (
        <p>
          Use the <strong>arrow keys</strong> to move. Distance to
          destination: <strong>{Math.round(distance)} m</strong> (delivered at
          &lt; 10 m)
        </p>
      )}

      <div className="h-[28rem] w-full overflow-hidden rounded-2xl border border-gray-900">
        <DeliveryMap
          center={destination}
          destination={destination}
          courier={position}
          showRadius
        />
      </div>
    </section>
  );
};
