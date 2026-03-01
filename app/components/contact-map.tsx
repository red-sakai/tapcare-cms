"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

const rizalHighSchoolPosition: [number, number] = [14.5869, 121.0947];

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ContactMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container, {
      center: rizalHighSchoolPosition,
      zoom: 15,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      opacity: 0.8,
    }).addTo(map);

    L.circle(rizalHighSchoolPosition, {
      radius: 140,
      color: "#dc2626",
      fillColor: "#ef4444",
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(map);

    L.marker(rizalHighSchoolPosition)
      .addTo(map)
      .bindPopup("<strong>Rizal High School</strong><br />Dr. Sixto Antonio Avenue, Pasig City");

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative h-[280px] overflow-hidden rounded-xl border border-white/20 bg-cover bg-center bg-no-repeat sm:h-[340px]"
      style={{ backgroundImage: "url('/tapcare-assets/rhs-bg.png')" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-3 z-[1000] -translate-x-1/2 rounded-full bg-red-900/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
        Rizal High School
      </div>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}