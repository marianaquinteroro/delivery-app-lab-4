"use client";

import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";

export default function Store() {
  const { user, isLoading } = useAuth();
  const {
    storeDetail,
    isLoadingStoreDetail,
    updateStoreStatus,
    isUpdatingStatus,
    statusError,
  } = useStore(String(user?.id));

  if (isLoading) {
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
        {storeDetail?.products.length === 0 ? (
          <p>No products</p>
        ) : isLoadingStoreDetail ? (
          <p>Loading Products...</p>
        ) : (
          <section>
            <p>{storeDetail?.store.name} Products</p>
            {storeDetail?.products.map((product) => (
              <article key={product.id}>
                <p>{product.name}</p>
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}
