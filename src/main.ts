import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { setWorkerUrl } from 'maplibre-gl'
import App from './app/App.vue'
import { router } from './app/router'
import './style.css' // also pulls in maplibre-gl.css (layered)

// Served verbatim by the maplibre-worker plugin in vite.config.ts — maplibre cannot
// resolve its own worker under Vite, and without it nothing renders on the map.
setWorkerUrl('/maplibre-gl-worker.mjs')

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin)
  .mount('#app')