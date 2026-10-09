"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { Store, StoreDetail } from "@/src/types/stores.types";
import { useEffect, useState } from "react";

export const useStore = (userId: string) => {
  const { user } = useAuth();
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>(null);
  const [isLoadingStoreDetail, setIsLoadingStoreDetail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();

    const getStoreDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/stores/${userId}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          throw new Error("Store not found");
        }
        if (!res.ok) {
          throw new Error("Couldn't get Store");
        }

        const data: StoreDetail = await res.json();
        console.log(data);

        setStoreDetail(data);
        setError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setError(String(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingStoreDetail(false);
        }
      }
    };

    getStoreDetail();

    return () => controller.abort();
  }, [userId]);

  const updateStoreStatus = async () => {
    if (!user || !storeDetail) return;

    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/stores/${storeDetail.store.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            isOpen: !storeDetail.store.is_open,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Couldn't update the store status");
      }

      const updatedStore: Store = await res.json();
      setStoreDetail((prev) => prev && { ...prev, store: updatedStore });
    } catch (error) {
      console.error(error);
      setStatusError(
        error instanceof Error
          ? error.message
          : "Couldn't update the store status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    storeDetail,
    isLoadingStoreDetail,
    error,
    updateStoreStatus,
    isUpdatingStatus,
    statusError,
  };
};
