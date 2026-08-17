<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as maplibregl from "maplibre-gl";
import type { Point as GeoJsonPoint } from "geojson";
import { useSchools } from "@/entities/school/api/useSchools";
import type { School } from "@/entities/school/model/types";
import LoadingState from "@/shared/ui/LoadingState.vue";
import ErrorState from "@/shared/ui/ErrorState.vue";
import { Card } from "@/shared/ui/card";

const mapContainer = ref<HTMLDivElement | null>(null);
let map: maplibregl.Map | null = null;

const { schools, loading, error } = useSchools();

// Build a GeoJSON FeatureCollection from school list
function toGeoJson(list: School[]) {
  return {
    type: "FeatureCollection" as const,
    features: list.map((s) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] },
      properties: {
        name: s.name,
        npsn: s.npsn,
        stage: s.stage,
        status: s.status,
        province: s.province,
        city: s.city,
        district: s.district,
        address: s.address,
      },
    })),
  };
}

function renderSchools(list: School[]) {
  if (!map) return;

  // Add source once, then update its data on subsequent loads
  const existing = map.getSource("schools") as
    | maplibregl.GeoJSONSource
    | undefined;
  const data = toGeoJson(list);
  if (existing) {
    existing.setData(data as never);
  } else {
    map.addSource("schools", {
      type: "geojson",
      data: data as never,
      cluster: true, // Bonus 1: clustering
      clusterRadius: 50,
    });

    // Cluster circles
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "schools",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#2563eb",
        "circle-radius": ["step", ["get", "point_count"], 15, 20, 22, 100, 30],
        "circle-opacity": 0.8,
      },
    });
    // Cluster count labels
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "schools",
      filter: ["has", "point_count"],
      layout: { "text-field": "{point_count_abbreviated}", "text-size": 12 },
      paint: { "text-color": "#ffffff" },
    });
    // Single (unclustered) points
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "schools",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#ef4444",
        "circle-radius": 6,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Click a single school -> popup (requirement poin 3)
    map.on("click", "unclustered-point", (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const p = f.properties as Record<string, string>;
      const coords = (f.geometry as GeoJsonPoint).coordinates.slice() as [
        number,
        number,
      ];
      const html =
        "<strong>" +
        p.name +
        "</strong><br/>" +
        "NPSN: " +
        p.npsn +
        "<br/>" +
        "Jenjang: " +
        p.stage +
        " | Status: " +
        p.status +
        "<br/>" +
        p.district +
        ", " +
        p.city +
        "<br/>" +
        p.province +
        "<br/>" +
        p.address +
        "<br/>" +
        "Lat: " +
        coords[1] +
        ", Lng: " +
        coords[0];
      new maplibregl.Popup().setLngLat(coords).setHTML(html).addTo(map!);
    });

    // Click a cluster -> zoom into it (Bonus 1)
    map.on("click", "clusters", (e) => {
      const f = map!.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      })[0];
      const clusterId = f.properties?.cluster_id;
      const src = map!.getSource("schools") as maplibregl.GeoJSONSource;
      src.getClusterExpansionZoom(clusterId).then((zoom) => {
        map!.easeTo({
          center: (f.geometry as GeoJsonPoint).coordinates as [number, number],
          zoom,
        });
      });
    });

    // Cursor feedback
    map.on("mouseenter", "unclustered-point", () => {
      map!.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "unclustered-point", () => {
      map!.getCanvas().style.cursor = "";
    });
  }

  // Auto fit bounds (requirement poin 4)
  if (list.length > 0) {
    const bounds = new maplibregl.LngLatBounds();
    for (const s of list) bounds.extend([s.lng, s.lat]);
    map.fitBounds(bounds, { padding: 48, maxZoom: 12 });
  }
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value as HTMLDivElement,
    style: "https://demotiles.maplibre.org/style.json", // free vector style, no API key
    center: [118, -2], // Indonesia
    zoom: 4,
  });
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  // If data already loaded before map is ready, render on load
  map.on("load", () => {
    if (schools.value && schools.value.length) renderSchools(schools.value);
  });
});

// Re-render whenever data changes (map may load before/after fetch)
watch(schools, (list) => {
  if (map && map.isStyleLoaded() && list) renderSchools(list);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="relative h-[calc(100vh-57px)] w-full">
    <div ref="mapContainer" class="absolute inset-0" />
    <Card
      v-if="loading"
      class="absolute left-1/2 top-4 -translate-x-1/2 px-3 py-1"
    >
      <LoadingState text="Loading schools..." />
    </Card>
    <Card
      v-if="error"
      class="absolute left-1/2 top-4 -translate-x-1/2 px-3 py-1"
    >
      <ErrorState text="Failed to load schools." />
    </Card>
  </div>
</template>
