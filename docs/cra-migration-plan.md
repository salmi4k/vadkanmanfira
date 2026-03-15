# CRA Migration Notes

The frontend migration away from Create React App is now complete.

Current state:

- local development runs through `vite`
- production builds output to `dist/`
- the frontend reads `VITE_CONTENT_PACK`
- tests run through `vitest`
- Azure Static Web Apps deploys the Vite build output together with the managed
  `/api` functions

The old CRA plan existed because the app had outgrown `react-scripts` and was
already carrying React 19, managed Azure Static Web Apps APIs, and a more
feature-grouped codebase than CRA was a good fit for.

What changed in practice:

- `react-scripts` was removed
- the root HTML entry moved to [`fredagskoll-frontend/index.html`](../fredagskoll-frontend/index.html)
- frontend env handling moved from `REACT_APP_CONTENT_PACK` to
  `VITE_CONTENT_PACK`
- the deploy workflow now publishes `dist/` instead of `build/`
- the test runner moved from CRA/Jest glue to `vitest` + `jsdom`

Things that stayed the same:

- Azure Static Web Apps remains the hosting target
- the managed API still lives in `/api`
- the repo still builds both `public` and `team` content packs from the same
  frontend
- public assets, branding generation, and build metadata generation are still
  handled in the repo

This file is kept as a short historical note so the repo still explains why the
toolchain changed, but it is no longer an open migration plan.
