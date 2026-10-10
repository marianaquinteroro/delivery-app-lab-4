"use client";

import { Loader } from "@/src/components/ui/Loader";
import { useClientOrders } from "@/src/hooks/orders/useClientOrders";

export default function ClientOrdersPage() {
  const { orders, isLoading, error } = useClientOrders();

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
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No Orders to show</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order, index) => (
            <article
              className="flex flex-col gap-4 p-4 rounded-2xl border border-gray-900"
              key={order.id}
            >
              <p className="text-xl font-medium">Order #{index + 1}</p>
              <p>Status: {order.status}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
