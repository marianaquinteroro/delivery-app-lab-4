"use client";

import { useAuth } from "@/src/hooks/useAuth";

export default function Store() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      {isLoading ? (
        <p>Loading user</p>
      ) : (
        <h2>Hello from Store - Admin Page {user?.name}</h2>
      )}
    </div>
  );
}
