# NTX Frontend Technical Test

A single Vue 3 + TypeScript SPA covering all four challenges from the NTX frontend technical test: a Promise Queue implementation, an AI-output review, an interactive vector map of Indonesian schools, and an anime search powered by the AniList GraphQL API. The project follows a **Feature-Sliced Design (FSD)** architecture and includes JWT-style authentication with role-based access control.

## Tech Stack

| Area          | Choice                                                                              |
| ------------- | ----------------------------------------------------------------------------------- |
| Build tool    | Vite                                                                                |
| Framework     | Vue 3 (Composition API) + TypeScript                                                |
| Routing       | Vue Router 4 (guards + RBAC)                                                        |
| State         | Pinia (auth session)                                                                |
| Data fetching | TanStack Query (`@tanstack/vue-query`)                                              |
| Map           | MapLibre GL JS + [OpenFreeMap](https://openfreemap.org) vector basemap (no API key) |
| GraphQL       | `graphql-request` (AniList API)                                                     |
| Styling       | Tailwind CSS v4 + shadcn-vue (built on Reka UI)                                     |
| Icons         | `lucide-vue-next`                                                                   |
| Testing       | Vitest                                                                              |

## Features

| Chapter | Feature                  | Location                                                                                         |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| BAB 01  | Sequential Promise Queue | `src/challenges/promise-queue/` (`promiseQueue`)                                                 |
| BAB 02  | Review & resilient fix   | `src/challenges/promise-queue/` (`promiseQueueSettled`) + [`docs/answers.md`](./docs/answers.md) |
| BAB 03  | Vector map of schools    | `pages/map`, `widgets/school-map`, `entities/school`                                             |
| BAB 04  | Anime search (GraphQL)   | `pages/anime`, `widgets/anime-search`, `entities/anime`, `features/search-anime`                 |
| Auth    | JWT flow + RBAC          | `entities/session`, `features/auth`, `pages/login`, `pages/forbidden`, guard in `app/router.ts`  |

Highlights:

- **Map** — vector/non-raster basemap, auto fit-bounds, clustering, click-to-inspect popups, loading/error states.
- **Anime** — popular list on load, debounced search, stale-response guard, pagination (load more), data mapper, empty/error states.
- **Auth** — login, protected routes, role-based access (admin/user), silent token refresh, logout.

## Project Structure (Feature-Sliced Design)

```
src/
├── challenges/         # BAB 01 & 02 — standalone algorithms (outside FSD)
├── app/                # router, root App, global setup
├── pages/              # route-level views (map, anime, login, forbidden)
├── widgets/            # composite UI blocks (school-map, anime-search)
├── features/           # user interactions (search-anime, auth)
├── entities/           # domain models + data access (school, anime, session)
└── shared/             # api clients, UI kit, config, helpers
```

FSD layers import downward only (`app → pages → widgets → features → entities → shared`).

## Getting Started

### Prerequisites

- Node.js ≥ 20

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```bash
VITE_API_BASE=https://dummy-server-gamma.vercel.app
```

### Run

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Available Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the Vite dev server           |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview the production build        |
| `npm test`           | Run unit tests (Vitest)             |
| `npm run demo:queue` | Run the Promise Queue console demo  |

## Authentication (demo)

The app is gated behind login. Use one of the demo accounts:

| Email            | Password   | Role  |
| ---------------- | ---------- | ----- |
| `admin@ntx.test` | `admin123` | admin |
| `user@ntx.test`  | `user123`  | user  |

Behavior:

- Visiting a protected route while logged out redirects to `/login`.
- `/anime` requires the `admin` role — logging in as `user` and opening it redirects to `/403`.
- The access token silently refreshes in the background before it expires.

> **Note:** authentication is **mocked**. The provided data endpoints have no login API, and HttpOnly cookies can only be set by a backend, so the full JWT/refresh/HttpOnly flow is simulated in the client. See [Assumptions](#assumptions) and [`docs/answers.md`](./docs/answers.md) for details.

## Testing

```bash
npm test
```

The Promise Queue (BAB 01 & 02) is verified by unit tests, including proof that execution is sequential and that a failing task does not stop the queue. Full answers and captured execution output are in [`docs/answers.md`](./docs/answers.md#bukti-eksekusi--bab-01--02).

## Assumptions

- **Mock auth** — the given endpoints (schools + AniList) expose no login API, and HttpOnly cookies require a backend to set them. Auth is therefore simulated in-app to demonstrate the required concepts (access + refresh tokens, silent refresh, guards, RBAC). Tokens are held in memory (not `localStorage`) to avoid XSS, so a full page reload signs the user out — in production the HttpOnly refresh cookie would restore the session on boot.
- **Map basemap** — [OpenFreeMap](https://openfreemap.org) (`tiles.openfreemap.org/styles/liberty`) is used for vector tiles: free, no API key, no registration. Cluster-count labels use the `Noto Sans Bold` font because OpenFreeMap's glyph server serves Noto rather than the style-spec default.
- **Styling** — Tailwind v4 uses CSS cascade layers; MapLibre's CSS is imported via `layer(components)` so Tailwind utilities keep precedence.

## Additional Questions

Written answers to the per-chapter questions (BAB 01–04) and notes on AI usage are in [`docs/answers.md`](./docs/answers.md).
