"use client";

import { useEffect, useState } from "react";
import { StoreDetail } from "../types/stores.types";

export const useStoreDetail = (storeId: string) => {
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>(null);
  const [isLoadingStoreDetail, setIsLoadingStoreDetail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getStoreDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/stores/store-detail/${storeId}`,
          {
            signal: controller.signal,
          },
        );

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
  }, [storeId]);

  return {
    storeDetail,
    isLoadingStoreDetail,
    error,
  };
};
