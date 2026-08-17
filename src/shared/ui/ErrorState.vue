<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
defineProps<{ text?: string }>()
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-10 text-sm text-destructive">
    <AlertCircle class="h-4 w-4" />
    {{ text ?? 'Something went wrong.' }}
  </div>
</template>