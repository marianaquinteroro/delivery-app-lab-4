"use client";

import dynamic from "next/dynamic";

export const DeliveryMap = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
});
