"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "../ui/Button";

export const Header = () => {
  const { logOut } = useAuth();
  return (
    <header className="w-full flex items-center justify-end p-4">
      <Button secondary onClick={logOut}>Log out</Button>
    </header>
  );
};
