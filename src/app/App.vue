<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { MapPin, Clapperboard } from "lucide-vue-next";
</script>

<template>
  <div class="min-h-screen">
    <nav class="flex gap-1 border-b p-3 text-sm">
      <RouterLink
        to="/map"
        class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        <MapPin class="h-4 w-4" /> Map
      </RouterLink>
      <RouterLink
        to="/anime"
        class="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        <Clapperboard class="h-4 w-4" /> Anime
      </RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
