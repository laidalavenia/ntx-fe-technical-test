<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@/shared/ui/button";
</script>

<template>
  <div class="mx-auto mt-20 max-w-sm text-center">
    <h1 class="text-2xl font-bold">403 - Forbidden</h1>
    <p class="mt-2 text-sm text-muted-foreground">
      Kamu tidak punya akses ke halaman ini.
    </p>
    <RouterLink to="/map">
      <Button class="mt-4">Back to Map</Button>
    </RouterLink>
  </div>
</template>
