"use client";
import { useStores } from "@/src/hooks/useStores";
import Link from "next/link";

export const ClientStoresList = () => {
  const { stores, isLoading, error } = useStores();

  if (error) {
    return (
      <section>
        <p>{error} Please try later</p>
      </section>
    );
  }

  return (
    <section className="flex gap-4">
      {isLoading ? (
        <p>Loading Stores</p>
      ) : (
        stores.map((store) => (
          <article key={store.id} className="bg-red-300">
            <Link href={`/client/store-detail/${store.id}`}>
              <p>{store.name}</p>
            </Link>
          </article>
        ))
      )}
    </section>
  );
};
