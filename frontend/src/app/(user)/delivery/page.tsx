"use client";

import { ActiveDelivery } from "@/src/components/delivery/ActiveDelivery";
import { AvailableOrdersList } from "@/src/components/delivery/AvailableOrdersList";
import { Loader } from "@/src/components/ui/Loader";
import { useDeliveryOrders } from "@/src/hooks/delivery/useDeliveryOrders";
import { useAuth } from "@/src/hooks/useAuth";

export default function Delivery() {
  const { user } = useAuth();
  const {
    availableOrders,
    activeOrder,
    isLoading,
    error,
    acceptingId,
    acceptOrder,
    finishDelivery,
  } = useDeliveryOrders();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center p-10">
        <Loader />
      </main>
    );
  }

  if (error) {
    return <p className="m-6">Something went wrong loading the orders.</p>;
  }

  return (
    <main className="m-6 flex flex-col gap-6">
      <div className="flex items-end gap-1">
        <h2 className="text-3xl font-bold">Hello,</h2>
        <p className="text-2xl">{user?.name}</p>
      </div>

      {activeOrder ? (
        <ActiveDelivery
          key={activeOrder.id}
          order={activeOrder}
          onFinish={finishDelivery}
        />
      ) : (
        <AvailableOrdersList
          orders={availableOrders}
          acceptingId={acceptingId}
          onAccept={acceptOrder}
        />
      )}
    </main>
  );
}
