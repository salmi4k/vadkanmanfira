# Phase 5 - Expansion

Status: in progress

GitHub issues:
- `#82` Turn the site into a PWA
- `#83` Add support for international celebration datasets

## What has been implemented

- PWA basics:
  - existing manifest cleaned up for installability
  - service worker added for shell caching and offline-safe navigation fallback
  - service worker registration added in the app bootstrap
  - install prompt support wired into the intro panel when the browser exposes it
- Dataset expansion:
  - the generated integration dataset now supports multiple datasets
  - current datasets:
    - `sv-SE`
    - `en-US`
  - API endpoints now accept a `dataset` query parameter
  - generated calendar exports now include:
    - `vadkanmanfira-sv-SE.ics`
    - `vadkanmanfira-en-US.ics`

## Main files

- `fredagskoll-frontend/public/manifest.json`
- `fredagskoll-frontend/public/service-worker.js`
- `fredagskoll-frontend/src/registerServiceWorker.ts`
- `fredagskoll-frontend/src/hooks/useInstallPrompt.ts`
- `fredagskoll-frontend/src/features/expansion/internationalCelebrations.ts`
- `fredagskoll-frontend/scripts/generate-integration-assets.ts`
- `api/shared/publicCelebrations.js`

## Notes

- The PWA layer is intentionally modest: installable shell first, deeper offline behavior later.
- International dataset support is currently implemented in the integration layer rather than the full frontend date-picking experience.
- The expansion path is now structural instead of hypothetical: adding another dataset means extending the dataset registry and generator, not rewriting the API surface.
