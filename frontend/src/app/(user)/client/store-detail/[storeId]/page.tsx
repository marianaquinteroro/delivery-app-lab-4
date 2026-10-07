"use client";

import { useCreateOrder } from "@/src/hooks/orders/useCreateOrder";
import { useStoreDetail } from "@/src/hooks/useStoreDetail";
import { useParams } from "next/navigation";

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { storeDetail, isLoading, error } = useStoreDetail(storeId);

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

  if (isLoading) {
    return (
      <section>
        <p>Loading Store Detail...</p>
      </section>
    );
  }

  return (
    <div>
      <h2>Store {storeDetail?.store.name}</h2>
      {storeDetail?.products.length === 0 ? (
        <p>This store have no products</p>
      ) : (
        <section>
          Store Products
          {storeDetail?.products.map((product) => (
            <article key={product.id}>
              <p>{product.name}</p>
              <p>${product.price}</p>
              <div>
                <button
                  onClick={() => handleDeleteQuantity(product.id)}
                  disabled={getQuantity(product.id) === 1}
                >
                  -
                </button>
                <p>{getQuantity(product.id)}</p>
                <button
                  onClick={() => handleAddQuantity(product.id)}
                  disabled={storeDetail.store.is_open === false}
                >
                  +
                </button>
              </div>
              <button
                className="bg-red-500 disabled:bg-red-200"
                onClick={() => handleAddOrderItems(product)}
              >
                Add to order
              </button>
            </article>
          ))}
          <button
            className="bg-blue-500 disabled:bg-blue-100"
            onClick={() => handleCreateOrder(storeDetail!)}
            disabled={
              orderItems.length === 0 || storeDetail?.store.is_open === false
            }
          >
            Create Order
          </button>
        </section>
      )}
    </div>
  );
}
