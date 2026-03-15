# Vad kan man fira?

`Vad kan man fira?` is a React app with managed Azure Static Web Apps APIs that
decides whether a Swedish date deserves celebration, resignation, baked goods,
or a dry remark about calendar reality.

The shipped product lives in `fredagskoll-frontend` and is deployed to Azure
Static Web Apps from the `main` branch.

## Content packs

The app now supports two variants on top of the same shared core:

- `public`
  Default build. Uses the public `VKMF` branding and excludes the internal team
  weekday lore.
- `team`
  Keeps the private weekday celebrations such as `Köttonsdag`, `Fisktorsdag`,
  and `Marmeladfredag`, plus the `Mojo` team branding.

Set the variant with:

```sh
$env:REACT_APP_CONTENT_PACK="team"
```

If the variable is unset, the app defaults to `public`.

## Project structure

- `fredagskoll-frontend/src/App.tsx`
  Main composition layer for the UI.
- `fredagskoll-frontend/src/contentPack.ts`
  Content-pack selection, public/team boundaries, and recurring weekday rules.
- `fredagskoll-frontend/src/dayLogic.ts`
  Date classification and official Swedish holiday calculations.
- `fredagskoll-frontend/src/celebrations.ts`
  Built-in celebration content and pack-filtered exports.
- `fredagskoll-frontend/src/themeDaySpecificBlurbs.ts`
  Handwritten temadag overrides.
- `fredagskoll-frontend/src/themeDayCategoryBlurbs.ts`
  Category fallback blurbs for temadagar.
- `fredagskoll-frontend/src/data/temadagarByDate.json`
  Curated unofficial temadag dataset.
- `fredagskoll-frontend/public/images`
  Celebration images and source metadata.
- `api/blurbs`
  Azure Function endpoint for optional AI-generated blurb bundles.
- `api/shared`
  Request validation, prompt building, Azure OpenAI calling, and Table Storage cache logic.

## Application flow

See [docs/application-flow.md](docs/application-flow.md) for the full detailed
flow. The version below is the short, human-readable overview.

```mermaid
flowchart TD
    A[User picks a date] --> B[Frontend checks what kind of day it is]
    B --> C{Celebration, theme day, or ordinary day?}
    C --> D[Build the page content]
    D --> E[Load extra context like name day and upcoming dates]
    E --> F[Optionally ask the AI API for better blurbs]
    F --> G[Use cached or newly generated AI text when available]
    F --> H[Otherwise keep local built-in text]
    G --> I[Render the final card]
    H --> I[Render the final card]
```

## Built-in celebration rules

Shared core:

- `allahjartansdag`: February 14
- `fettisdag`: calculated from Easter
- `paskafton`: calculated from Easter
- `vaffeldagen`: March 25
- `valborg`: April 30
- `nationaldagen`: June 6
- `midsommarafton`: Friday between June 19 and June 25
- `kanelbullensdag`: October 4
- `kladdkakansdag`: November 7
- `surstrommingspremiar`: third Thursday of August
- `lucia`: December 13
- `julafton`: December 24
- `nyarsafton`: December 31

Team pack only:

- `kottonsdag`: every Wednesday
- `fisktorsdag`: every Thursday
- `marmeladfredag`: every Friday

Ordinary days still pick up temadagar, seasonal notes, and other sidebar/context
logic as usual.

## Development

```sh
cd fredagskoll-frontend
npm install
npm start
```

Run the team edition locally:

```sh
$env:REACT_APP_CONTENT_PACK="team"
npm start
```

Useful checks:

```sh
npm test -- --runInBand --watchAll=false
npm run test:visual
npm run build
```

## Deployment

- GitHub Actions deploys the frontend and managed API from `main`
- `.github/workflows/deploy-static-apps.yml` builds the app twice:
  - `REACT_APP_CONTENT_PACK=public` deploys to `vadkanmanfira`
  - `REACT_APP_CONTENT_PACK=team` deploys to `fredagskoll`
- Both deployments include the managed API from `api/`
- Required GitHub Actions secrets:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_THANKFUL_BUSH_0D8565003_1`
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_GROUND_0B3AA2B03`
- Azure Static Web Apps hosts both variants
- The frontend calls the same-origin managed API at `/api/blurbs`
- SPA routing fallback lives in
  `fredagskoll-frontend/public/staticwebapp.config.json`

## Optional AI blurbs

The app can now ask a managed Azure Functions API for generated blurb bundles.
This is optional: if the API is unavailable or Azure OpenAI is not configured,
the frontend keeps using the existing handwritten/static blurbs.

The frontend calls:

- `/api/blurbs`

What it does:

- receives a structured date context from the frontend
- computes a deterministic request hash
- checks a hot cache row in Azure Table Storage first
- auto-generates one AI bundle for a new request key and serves cache after that
- can store up to 3 variants for the same request key, but only creates extra variants on explicit reroll
- enforces a real generation cooldown per request key before Azure OpenAI is called again
- rotates between cached variants when more than one already exists
- stores generated bundles in a separate bundle library table for reuse and tracking
- returns multiple options for:
  - `blurbs`
  - `titleEndings` for ordinary theme-day headlines
  - `cardNotes` for ordinary theme-day support text

Current table layout:

- `blurbcache`
  - one hot row per request key
  - stores request metadata, `useCount`, `lastUsedAt`, `lastGeneratedAt`, `lastBundleId`, and `bundleIdsJson`
- `blurblibrary`
  - one row per generated bundle
  - stores `bundleId`, `requestHash`, `generatedAt`, `model`, `useCount`, `lastUsedAt`,
    `titleEndingsJson`, `cardNotesJson`, and `blurbsJson`

Required Azure app settings for each Static Web App managed API:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION`
- `AZURE_TABLES_CONNECTION_STRING`

Local sample config lives in:

- `api/local.settings.sample.json`

## Data and sources

- Official holiday calculations are maintained in code
- Namnsdag data is fetched from the open `sholiday` API at runtime
- Temadagar are curated into a local dataset inspired by `temadagar.se`
- Public image credits are exposed in the app for reused Wikimedia Commons
  assets

## License

This repository is proprietary and `all rights reserved`.
No one is allowed to use, copy, modify, or redistribute this code without
prior permission from the repository owner. See [LICENSE](LICENSE).
