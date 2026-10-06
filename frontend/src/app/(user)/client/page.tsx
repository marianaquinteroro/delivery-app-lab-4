"use client";

import { useAuth } from "@/src/hooks/useAuth";

export default function Client() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      {isLoading ? (
        <p>Loading user</p>
      ) : (
        <h2>Hello from Consumer/Client Page {user?.name}</h2>
      )}
    </div>
  );
}
