"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DeliveryMap } from "@/src/components/map/DeliveryMap";
import { Loader } from "@/src/components/ui/Loader";
import { OrderStatusBadge } from "@/src/components/ui/OrderStatusBadge";
import { Toast } from "@/src/components/ui/Toast";
import { useOrderTracking } from "@/src/hooks/orders/useOrderTracking";
import { OrderStatus } from "@/src/types/orders.types";

const STATUS_MESSAGE: Record<OrderStatus, string> = {
  waiting_for_delivery: "Waiting for a courier to accept your order...",
  in_progress: "Your courier is on the way. Watch them move on the map!",
  delivered: "Your order has been delivered. Enjoy it!",
};

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, isLoading, error, toast, hideToast } =
    useOrderTracking(orderId);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center p-10">
        <Loader />
      </main>
    );
  }

  if (error || !order) {
    return <p className="m-6">We couldn&apos;t load this order.</p>;
  }

  const destination =
    order.delivery_lat !== null && order.delivery_lng !== null
      ? { lat: order.delivery_lat, lng: order.delivery_lng }
      : null;

  const courier =
    order.courier_lat !== null && order.courier_lng !== null
      ? { lat: order.courier_lat, lng: order.courier_lng }
      : null;

  return (
    <main className="m-6 flex flex-col gap-4">
      <Toast message={toast} onClose={hideToast} />
      <Link className="hover:underline w-fit" href="/client/orders">
        Back to my orders
      </Link>

      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Order from {order.store_name}</h2>
        <OrderStatusBadge status={order.status} />
      </div>
      <p>{STATUS_MESSAGE[order.status]}</p>

      {destination ? (
        <div className="h-[28rem] w-full overflow-hidden rounded-2xl border border-gray-900">
          <DeliveryMap
            center={destination}
            destination={destination}
            courier={courier}
            showRadius
          />
        </div>
      ) : (
        <p>This order has no delivery location.</p>
      )}
    </main>
  );
}
