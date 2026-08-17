import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "@/entities/session/model/session-store";
import type { Role } from "@/entities/session/model/types";

// Type the custom route meta fields
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: Role[];
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/map" },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login/LoginPage.vue"),
    },
    {
      path: "/403",
      name: "forbidden",
      component: () => import("@/pages/forbidden/ForbiddenPage.vue"),
    },
    {
      path: "/map",
      name: "map",
      component: () => import("@/pages/map/MapPage.vue"),
      meta: { requiresAuth: true }, // any logged-in role
    },
    {
      path: "/anime",
      name: "anime",
      component: () => import("@/pages/anime/AnimePage.vue"),
      meta: { requiresAuth: true, roles: ["admin"] }, // RBAC: admin only
    },
  ],
});

// Global navigation guard: auth + RBAC (covers all 4 conditions from the doc)
router.beforeEach((to) => {
  const session = useSessionStore();

  // Not logged in -> redirect to login, remembering where we came from
  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // Logged in but wrong role -> 403
  if (to.meta.roles && session.role && !to.meta.roles.includes(session.role)) {
    return { name: "forbidden" };
  }

  // Already logged in visiting /login -> go home
  if (to.name === "login" && session.isAuthenticated) {
    return { name: "map" };
  }

  return true;
});

export { router };
