"use client";

import Link from "next/link";
import { Loader } from "@/src/components/ui/Loader";
import { OrderStatusBadge } from "@/src/components/ui/OrderStatusBadge";
import { Toast } from "@/src/components/ui/Toast";
import { useClientOrders } from "@/src/hooks/orders/useClientOrders";

export default function ClientOrdersPage() {
  const { orders, isLoading, error, toast, hideToast } = useClientOrders();

  if (isLoading) {
    return (
      <main className="flex flex-col gap-4 items-center justify-center">
        <p>Loading your orders</p>
        <Loader />
      </main>
    );
  }
  if (error) {
    return (
      <div>
        <p>Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <main className="m-6">
      <Toast message={toast} onClose={hideToast} />
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No Orders to show</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <article
              className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-900"
              key={order.id}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xl font-medium">{order.store_name}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
              <Link
                className="hover:underline"
                href={`/client/orders/${order.id}`}
              >
                {order.status === "in_progress"
                  ? "Track delivery live"
                  : "View on map"}
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
