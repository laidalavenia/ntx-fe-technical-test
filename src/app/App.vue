<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { MapPin, Clapperboard, LogOut } from "lucide-vue-next";
import { useSessionStore } from "@/entities/session/model/session-store";
import { Button } from "@/shared/ui/button";

const session = useSessionStore();
const router = useRouter();

function onLogout() {
  session.logout();
  router.replace("/login");
}
</script>

<template>
  <div class="min-h-screen">
    <nav
      v-if="session.isAuthenticated"
      class="flex items-center gap-1 border-b p-3 text-sm"
    >
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
      <div class="ml-auto flex items-center gap-3">
        <span class="text-muted-foreground"
          >{{ session.user?.name }} ({{ session.role }})</span
        >
        <Button variant="outline" size="sm" @click="onLogout">
          <LogOut class="mr-1 h-4 w-4" /> Logout
        </Button>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
