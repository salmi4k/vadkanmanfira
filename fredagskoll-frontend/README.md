# Vad kan man fira? Frontend

This folder contains the actual product application for `Vad kan man fira?`.

## What it does

- classifies dates into built-in Swedish celebration types
- enriches ordinary dates with curated temadagar
- fetches namnsdag data from the `sholiday` API
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
$env:REACT_APP_CONTENT_PACK="team"
npm start
```

## Quality checks

```sh
npm test -- --runInBand --watchAll=false
npm run test:visual
npm run build
```

## Important files

- `src/App.tsx`
  Main composition layer
- `src/contentPack.ts`
  Public/team pack selection and recurring weekday rules
- `src/dayLogic.ts`
  Day classification and official holiday calculations
- `src/celebrations.ts`
  Built-in celebration content with pack-aware exports
- `src/themeDaySpecificBlurbs.ts`
  Handwritten temadag overrides
- `src/themeDayCategoryBlurbs.ts`
  Category-based temadag fallbacks
- `src/upcomingNotables.ts`
  Upcoming sidebar card logic
- `src/data/temadagarByDate.json`
  Curated temadagar dataset

## Deployment

The app is deployed via Azure Static Web Apps from the repository root
workflow:

- `.github/workflows/azure-static-web-apps-delightful-ground-0b3aa2b03.yml`
