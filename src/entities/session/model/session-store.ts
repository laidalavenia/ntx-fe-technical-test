import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Role, User } from "./types";
import { loginRequest, refreshRequest } from "../api/auth-api";

export const useSessionStore = defineStore("session", () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const role = computed<Role | null>(() => user.value?.role ?? null);

  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  // Schedule a silent refresh shortly before the access token (60s) expires
  function scheduleSilentRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(silentRefresh, 50 * 1000); // refresh at 50s
  }

  async function login(email: string, password: string) {
    const { tokens, user: u } = await loginRequest(email, password);
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
    user.value = u;
    scheduleSilentRefresh();
  }

  // Silent refresh: swap the access token in the background without UX disruption
  async function silentRefresh() {
    if (!refreshToken.value) return;
    try {
      const tokens = await refreshRequest(refreshToken.value);
      accessToken.value = tokens.accessToken;
      refreshToken.value = tokens.refreshToken;
      scheduleSilentRefresh();
    } catch {
      logout(); // refresh failed -> force re-login
    }
  }

  function logout() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = null;
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    role,
    login,
    silentRefresh,
    logout,
  };
});
