"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { DELIVERY_RADIUS_METERS } from "@/src/lib/config";
import { LatLng } from "@/src/types/orders.types";

const createIcon = (emoji: string, background: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${background};width:34px;height:34px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

const courierIcon = createIcon("🛵", "#111827");
const destinationIcon = createIcon("📍", "#ffffff");

const RecenterMap = ({ center }: { center: LatLng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [map, center.lat, center.lng]);
  return null;
};

const ClickHandler = ({
  onClick,
}: {
  onClick: (position: LatLng) => void;
}) => {
  useMapEvents({
    click: (e) => onClick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
};

export interface MapViewProps {
  center: LatLng;
  zoom?: number;
  destination?: LatLng | null;
  courier?: LatLng | null;
  showRadius?: boolean;
  onMapClick?: (position: LatLng) => void;
}

export default function MapView({
  center,
  zoom = 17,
  destination,
  courier,
  showRadius = false,
  onMapClick,
}: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      keyboard={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={center} />
      {onMapClick && <ClickHandler onClick={onMapClick} />}

      {destination && (
        <>
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          />
          {showRadius && (
            <Circle
              center={[destination.lat, destination.lng]}
              radius={DELIVERY_RADIUS_METERS}
              pathOptions={{ color: "#16a34a", fillOpacity: 0.2 }}
            />
          )}
        </>
      )}

      {courier && (
        <Marker position={[courier.lat, courier.lng]} icon={courierIcon} />
      )}
    </MapContainer>
  );
}
