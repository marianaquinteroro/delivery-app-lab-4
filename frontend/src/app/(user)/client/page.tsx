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
    <div>
      <Link href={"/client/orders"}>My Orders</Link>
      <h2>Hello {user?.name}</h2>
      <ClientStoresList />
    </div>
  );
}
