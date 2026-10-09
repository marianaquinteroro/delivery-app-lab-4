"use client";

import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";

export default function Store() {
  const { user, isLoading } = useAuth();
  const {
    storeDetail,
    isLoadingStoreDetail,
    updateStoreStatus,
    isUpdatingStatus,
    statusError,
  } = useStore(String(user?.id));

  if (isLoading || isLoadingStoreDetail) {
    return <section>Loading...</section>;
  }

  return (
    <div>
      <h2>
        {storeDetail?.store.name} is{" "}
        {storeDetail?.store.is_open ? "Open" : "Closed"}
      </h2>
      <div>
        <button onClick={updateStoreStatus} disabled={isUpdatingStatus}>
          {storeDetail?.store.is_open ? "Close store" : "Open store"}
        </button>
        {statusError && <p>{statusError}</p>}
      </div>
      <section>
        <Link href="/store-admin/create-product">Create a product</Link>
        {storeDetail?.products.length === 0 ? (
          <p>No products</p>
        ) : (
          <section>
            <p>{storeDetail?.store.name} Products</p>
            {storeDetail?.products.map((product) => (
              <article key={product.id}>
                <button>Edit</button>
                <p>{product.name}</p>
                <p>${product.price}</p>
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}
