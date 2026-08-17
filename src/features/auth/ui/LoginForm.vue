<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSessionStore } from "@/entities/session/model/session-store";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Loader2 } from "lucide-vue-next";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const session = useSessionStore();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  loading.value = true;
  error.value = "";
  try {
    await session.login(email.value, password.value);
    // Redirect back to the originally requested page, or /map
    const redirect = (route.query.redirect as string) || "/map";
    router.replace(redirect);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Card class="mx-auto mt-20 max-w-sm">
    <CardContent class="space-y-4 p-6">
      <h1 class="text-lg font-semibold">Login</h1>

      <div class="space-y-2">
        <Input v-model="email" type="email" placeholder="Email" />
        <Input
          v-model="password"
          type="password"
          placeholder="Password"
          @keyup.enter="onSubmit"
        />
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

      <Button class="w-full" :disabled="loading" @click="onSubmit">
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        {{ loading ? "Signing in..." : "Sign in" }}
      </Button>

      <div class="rounded bg-muted p-2 text-xs text-muted-foreground">
        Demo: <strong>admin@ntx.test / admin123</strong> (admin) ·
        <strong>user@ntx.test / user123</strong> (user)
      </div>
    </CardContent>
  </Card>
</template>
