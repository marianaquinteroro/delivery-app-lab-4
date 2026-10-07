"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useStoreDetail } from "@/src/hooks/useStoreDetail";

export default function Store() {
  const { user, isLoading } = useAuth();
  const { storeDetail } = useStoreDetail(String(user?.id));

  if (isLoading) {
    return <section>Loading...</section>;
  }

  return (
    <div>
      <h2>
        {user?.name} is {storeDetail?.store.is_open ? "Open" : "Closed"}
      </h2>
      <section>
        <p>My products</p>
        {storeDetail?.products.length === 0 ? (
          <p>No products</p>
        ) : (
          <section>
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
