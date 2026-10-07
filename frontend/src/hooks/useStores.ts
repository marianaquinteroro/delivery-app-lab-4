"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { Store } from "../types/stores.types";

export const useStores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();

    const getStores = async () => {
      try {
        const res = await fetch("http://localhost:8080/stores", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Couldn't get Stores");
        }

        const data: Store[] = await res.json();
        setStores(data);
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setError(String(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getStores();

    return () => controller.abort();
  }, [user]);

  return {
    stores,
    isLoading,
    error,
  };
};
