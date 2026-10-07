"use client";

import { useClientOrders } from "@/src/hooks/orders/useClientOrders";

export default function ClientOrdersPage() {
  const { orders, isLoading, error } = useClientOrders();

  if (isLoading) {
    return (
      <div>
        <p>Loading your orders...</p>
      </div>
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
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No Orders to show</p>
      ) : (
        <section>
          {orders.map((order, index) => (
            <article key={order.id}>
              <p>Order #{index + 1}</p>
              <p>Status: {order.status}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
