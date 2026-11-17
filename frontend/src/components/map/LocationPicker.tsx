"use client";

import { useEffect, useState } from "react";
import { DEFAULT_MAP_CENTER } from "@/src/lib/config";
import { LatLng } from "@/src/types/orders.types";
import { DeliveryMap } from "./DeliveryMap";

export const LocationPicker = ({
  value,
  onChange,
}: {
  value: LatLng | null;
  onChange: (position: LatLng) => void;
}) => {
  const [center, setCenter] = useState<LatLng>(DEFAULT_MAP_CENTER);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    );
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-600">
        Click on the map to choose the delivery location
      </p>
      <div className="h-72 w-full overflow-hidden rounded-2xl border border-gray-900">
        <DeliveryMap
          center={center}
          destination={value}
          onMapClick={onChange}
        />
      </div>
      {value && (
        <p className="text-xs text-gray-500">
          Selected: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
};
