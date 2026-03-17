# booking-ui (frontend)

React + TypeScript + Vite frontend for the healthcare booking platform.

## Stack

- **React 19** + **TypeScript**
- **Vite** – build and dev server
- **React Router** – routing
- **TanStack Query** – API state and caching
- **Tailwind CSS** – styling

## Run locally

1. **Start the Quarkus backend** (from `booking-platform`):

   ```bash
   ./mvnw quarkus:dev -Dquarkus.profile=dev
   ```

   Backend runs at `http://localhost:8080` with API under `/api/v1`.

2. **Start the frontend**:

   ```bash
   npm install
   npm run dev
   ```

   Frontend runs at `http://localhost:5173`. API calls are proxied to the backend via Vite.

## Scripts

- `npm run dev` – dev server (port 5173, proxies `/api` to backend)
- `npm run build` – production build to `dist/`
- `npm run preview` – serve `dist/` locally

## API base URL

By default the app uses relative URLs (`/api/v1/...`), so the Vite proxy sends requests to the backend. To point at another host (e.g. deployed API), set:

```bash
VITE_API_URL=http://your-api-host:8080
```

Then run `npm run build` or `npm run dev`.
