"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "../ui/Loader";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) router.replace("/login");
  }, [isLoading, token, router]);

  if (isLoading || !token) {
    return (
      <main className="flex items-center justify-center p-10">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
};
