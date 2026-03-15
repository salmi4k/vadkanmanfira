# Vad kan man fira? Frontend

This folder contains the actual product application for `Vad kan man fira?`,
including the frontend that is deployed together with a managed Azure Static
Web Apps API from the repository root.

## What it does

- classifies dates into built-in Swedish celebration types
- enriches ordinary dates with curated temadagar
- fetches namnsdag data from the `sholiday` API
- can optionally fetch AI-generated blurb bundles from `/api/blurbs`
- shows upcoming official holidays and notable dates
- renders themed media, blurbs, and public image credits
- supports separate `public` and `team` content packs on the same shared core

## Local development

```sh
npm install
npm start
```

The dev server runs on `http://localhost:3000`.

Run the team variant locally:

```sh
$env:VITE_CONTENT_PACK="team"
npm start
```

## Quality checks

```sh
npm test
npm run test:watch
npm run test:visual
npm run build
```

## Important files

- `src/App.tsx`
  Main composition layer
- `src/index.tsx`
  Frontend entrypoint mounted by Vite
- `src/contentPack.ts`
  Public/team pack selection and recurring weekday rules
- `src/dayLogic.ts`
  Day classification and official holiday calculations
- `src/features/celebrations/celebrationDefinitions.ts`
  Built-in celebration rule catalog and calculated holiday definitions
- `src/features/celebrations/celebrations.ts`
  Built-in celebration content with pack-aware exports
- `src/features/theme-days/themeDayPriority.ts`
  Curated ordering for crowded temadag dates
- `src/features/theme-days/themeDaySpecificBlurbs.ts`
  Handwritten temadag overrides
- `src/features/theme-days/themeDayCategoryBlurbs.ts`
  Category-based temadag fallbacks
- `src/hooks/useAppShellState.ts`
  App-shell UI state such as date, dialogs, and disclosure panels
- `src/appViewModel.ts`
  Derived titles, kicker text, and AI request inputs
- `index.html`
  Vite HTML shell for local dev and production builds
- `vite.config.ts`
  Vite build/dev configuration and chunk splitting
- `src/features/upcoming/upcomingNotables.ts`
  Upcoming sidebar card logic
- `src/data/temadagarByDate.json`
  Curated temadagar dataset

## Deployment

The app is deployed via Azure Static Web Apps from the repository root
workflow:

- `.github/workflows/deploy-static-apps.yml`

That workflow builds the same app twice from `main` and includes the shared
managed API from `../api`:

- `VITE_CONTENT_PACK=public` -> `vadkanmanfira`
- `VITE_CONTENT_PACK=team` -> `fredagskoll`

In production, the frontend calls the same-origin managed API path:

- `/api/blurbs`
