"use client";

import { ClientStoresList } from "@/src/components/store/ClientStoresList";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";

export default function Client() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <p>Loading user</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4 m-6">
      <div className="flex items-end gap-1">
        <h2 className="text-3xl font-bold">Hello,</h2>
        <p className="text-2xl">{user?.name}</p>
      </div>
      <div className="flex items-end gap-4">
        <p className="text-2xl font-medium">Stores</p>
        <Link className="text-gray-900 hover:underline" href={"/client/orders"}>My orders</Link>
      </div>
      <ClientStoresList />
    </main>
  );
}
