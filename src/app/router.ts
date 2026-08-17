import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/map' },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/pages/map/MapPage.vue'),
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('@/pages/anime/AnimePage.vue'),
    },
    // Auth pages (see Bagian 10) — uncomment if auth is required:
    // { path: '/login', name: 'login', component: () => import('@/pages/login/LoginPage.vue') },
    // { path: '/403', name: 'forbidden', component: () => import('@/pages/forbidden/ForbiddenPage.vue') },
  ],
})

export { router }