"use client";

import { useAuth } from "@/src/hooks/useAuth";

export const Header = () => {
  const { logOut } = useAuth();
  return (
    <header>
      <button onClick={logOut}>Logout</button>
    </header>
  );
};
