import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Driver Incident Evidence",
    short_name: "Bitácora",
    description: "Bitácora de incidentes para conductores de reparto",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8F6",
    theme_color: "#162B3A",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
