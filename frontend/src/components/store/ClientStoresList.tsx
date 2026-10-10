"use client";
import { useStores } from "@/src/hooks/useStores";
import Link from "next/link";
import { Loader } from "../ui/Loader";

export const ClientStoresList = () => {
  const { stores, isLoading, error } = useStores();

  if (error) {
    return (
      <section>
        <p>{error} Please try later</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stores.map((store) => (
        <article
          key={store.id}
          className=" border border-gray-900 flex flex-col gap-4 rounded-2xl p-4"
        >
          <Link href={`/client/store-detail/${store.id}`}>
            <p>{store.name}</p>
          </Link>
        </article>
      ))}
    </section>
  );
};
