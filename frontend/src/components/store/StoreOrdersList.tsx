"use client";

import { useStoreOrders } from "@/src/hooks/orders/useStoreOrders";
import { Loader } from "../ui/Loader";
import { OrderStatusBadge } from "../ui/OrderStatusBadge";
import { Toast } from "../ui/Toast";

export const StoreOrdersList = ({ storeId }: { storeId: string }) => {
  const { orders, isLoading, error, toast, hideToast } =
    useStoreOrders(storeId);

  return (
    <section className="mt-8 flex flex-col gap-4">
      <Toast message={toast} onClose={hideToast} />
      <h3 className="text-xl font-bold">Orders</h3>

      {isLoading && <Loader />}
      {error && <p>Couldn&apos;t load the orders.</p>}
      {!isLoading && !error && orders.length === 0 && <p>No orders yet</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="flex flex-col gap-2 rounded-2xl border border-gray-900 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">#{order.id.slice(0, 8)}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
