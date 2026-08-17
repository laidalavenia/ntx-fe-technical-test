import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

const require = createRequire(import.meta.url);

// maplibre v6 locates its worker with `new URL(`./${name}`, import.meta.url)`.
// That template literal is invisible to Vite's dep optimizer and to Rollup, so the
// worker file is never served in dev nor emitted in the build — it 404s, the worker
// dies, and nothing that is parsed off the main thread (vector tiles, GeoJSON
// sources, clusters) ever renders. Serving it from Vite is not an option either:
// Vite injects its HMR client into any .mjs it transforms, which throws in a worker.
//
// So we publish both worker files verbatim at the site root and point maplibre at
// them via setWorkerUrl() in main.ts.
const WORKER_FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

function maplibreWorker(): Plugin {
  const distDir = path.dirname(
    require.resolve("maplibre-gl/dist/maplibre-gl.mjs"),
  );
  const read = (name: string) => fs.readFileSync(path.join(distDir, name));

  return {
    name: "maplibre-worker",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split("?")[0].replace(/^\//, "");
        if (!name || !WORKER_FILES.includes(name)) return next();
        res.setHeader("Content-Type", "text/javascript");
        res.end(read(name));
      });
    },
    generateBundle() {
      for (const name of WORKER_FILES) {
        this.emitFile({ type: "asset", fileName: name, source: read(name) });
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), maplibreWorker()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
