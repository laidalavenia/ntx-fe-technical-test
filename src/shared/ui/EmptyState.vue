<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
defineProps<{ text?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
    <SearchX class="h-6 w-6" />
    {{ text ?? 'No data.' }}
  </div>
</template>