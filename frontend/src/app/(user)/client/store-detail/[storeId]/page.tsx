"use client";

import { Loader } from "@/src/components/ui/Loader";
import { useCreateOrder } from "@/src/hooks/orders/useCreateOrder";
import { useStoreDetail } from "@/src/hooks/useStoreDetail";
import { useParams } from "next/navigation";

import { Button } from "@/src/components/ui/Button";

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { storeDetail, isLoadingStoreDetail, error } = useStoreDetail(storeId);

  const {
    handleDeleteQuantity,
    getQuantity,
    handleAddQuantity,
    handleAddOrderItems,
    handleCreateOrder,
    orderItems,
  } = useCreateOrder();

  if (error) {
    return (
      <section>
        <p>We had a problem getting the Store Information. Please try again.</p>
      </section>
    );
  }

  if (isLoadingStoreDetail) {
    return (
      <main className="flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  return (
    <main className="m-6">
      <h2 className="text-2xl font-bold">{storeDetail?.store.name}</h2>
      {storeDetail?.products.length === 0 ? (
        <p>This store have no products</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-lg mt-4">Products</p>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeDetail?.products.map((product) => (
              <article
                className="flex flex-col gap-4 p-4 rounded-2xl border border-gray-900"
                key={product.id}
              >
                <p>{product.name}</p>
                <p>${product.price}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 py-2 px-4 w-fit border border-gray-900 rounded-full">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleDeleteQuantity(product.id)}
                      disabled={getQuantity(product.id) === 1}
                    >
                      -
                    </button>
                    <p>{getQuantity(product.id)}</p>
                    <button
                      className="cursor-pointer"
                      onClick={() => handleAddQuantity(product.id)}
                      disabled={storeDetail.store.is_open === false}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    secondary
                    onClick={() => handleAddOrderItems(product)}
                  >
                    Add to order
                  </Button>
                </div>
              </article>
            ))}
          </section>

          <div className="mt-6 w-fit p-4 rounded-xl flex flex-col gap-4 bg-gray-100">
            <p className="text-xl">Order summary</p>
            <div className="flex flex-col gap-2">
              {orderItems.map((order) => (
                <div key={order.product_id} className="flex items-end justify-between gap-4">
                  <p>{order.name}</p>
                  <p>x {order.quantity}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => handleCreateOrder(storeDetail!)}
              disabled={
                orderItems.length === 0 || storeDetail?.store.is_open === false
              }
            >
              Create Order
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
