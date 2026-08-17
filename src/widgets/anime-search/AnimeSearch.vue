<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, Star, Loader2 } from "lucide-vue-next";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useAnimeSearch } from "@/entities/anime/api/useAnimeSearch";
import { useDebounce } from "@/features/search-anime/useDebounce";
import ErrorState from "@/shared/ui/ErrorState.vue";
import EmptyState from "@/shared/ui/EmptyState.vue";

const keyword = ref("");
const debounced = useDebounce(keyword, 500);
const { data, loading, error, hasNextPage, searchAnime, loadMore } =
  useAnimeSearch();

// Load popular on mount, re-search on change, reload popular when cleared
watch(
  debounced,
  (val) => {
    searchAnime(val.trim());
  },
  { immediate: true },
);
</script>

<template>
  <div class="mx-auto max-w-5xl p-4">
    <div class="relative mb-4">
      <Search
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input v-model="keyword" placeholder="Search anime..." class="pl-9" />
    </div>

    <div
      v-if="loading && data.length === 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
    >
      <Skeleton v-for="n in 8" :key="n" class="h-64 w-full rounded-lg" />
    </div>

    <ErrorState v-else-if="error" text="Failed to fetch anime data." />
    <EmptyState
      v-else-if="!loading && keyword.trim() && data.length === 0"
      text="Anime not found."
    />

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <a
        v-for="anime in data"
        :key="anime.id"
        :href="anime.url"
        target="_blank"
        class="block"
      >
        <Card class="overflow-hidden pt-0 transition-shadow hover:shadow-md">
          <img
            :src="anime.cover"
            :alt="anime.title"
            class="h-52 w-full object-cover"
          />
          <CardContent class="p-2">
            <p class="line-clamp-2 text-sm font-medium">{{ anime.title }}</p>
            <p class="flex items-center gap-1 text-xs text-muted-foreground">
              {{ anime.year ?? "-" }} · {{ anime.episodes ?? "?" }} eps ·
              <Star class="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {{ anime.score ?? "-" }}
            </p>
          </CardContent>
        </Card>
      </a>
    </div>

    <div v-if="hasNextPage" class="mt-6 flex justify-center">
      <Button :disabled="loading" @click="loadMore">
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        {{ loading ? "Loading..." : "Load More" }}
      </Button>
    </div>
  </div>
</template>
