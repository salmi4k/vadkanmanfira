# Fredagskoll

Fredagskoll is a frontend-only React app that decides whether a Swedish date
deserves celebration, resignation, baked goods, or a dry remark about office
life.

The shipped product lives in `fredagskoll-frontend` and is deployed to Azure
Static Web Apps from the `main` branch.

## Project structure

- `fredagskoll-frontend/src/App.tsx`
  Main composition layer for the UI
- `fredagskoll-frontend/src/dayLogic.ts`
  Date classification and official Swedish holiday calculations
- `fredagskoll-frontend/src/celebrations.ts`
  Built-in celebration content for major special dates
- `fredagskoll-frontend/src/themeDaySpecificBlurbs.ts`
  Handwritten temadag overrides
- `fredagskoll-frontend/src/themeDayCategoryBlurbs.ts`
  Category fallback blurbs for temadagar
- `fredagskoll-frontend/src/data/temadagarByDate.json`
  Curated unofficial temadag dataset
- `fredagskoll-frontend/public/images`
  Celebration images and source metadata

## Built-in celebration rules

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
- `kottonsdag`: every Wednesday
- `fisktorsdag`: every Thursday
- `marmeladfredag`: every Friday
- ordinary days: no built-in major celebration, but temadagar may still apply

## Development

```sh
cd fredagskoll-frontend
npm install
npm start
```

Useful checks:

```sh
npm test -- --runInBand --watchAll=false
npm run test:visual
npm run build
```

## Deployment

- GitHub Actions deploys the frontend from `main`
- Azure Static Web Apps hosts the site
- SPA routing fallback lives in
  `fredagskoll-frontend/public/staticwebapp.config.json`

## Data and sources

- Official holiday calculations are maintained in code
- Namnsdag data is fetched from the open `sholiday` API at runtime
- Temadagar are curated into a local dataset inspired by `temadagar.se`
- Public image credits are exposed in the app for reused Wikimedia Commons
  assets
