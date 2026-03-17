# Phase 3 - Shareability

Status: in progress

GitHub issues:
- `#76` Generate share cards for celebrations
- `#78` Add celebration statistics
- `#79` Improve OpenGraph metadata for celebration pages

## What has been implemented

- A new shareability layer that can:
  - resolve a celebration slug into the next real date in the app
  - build stable share URLs and share-card URLs
  - support native sharing and copy-link fallback in the frontend
- A generated share-card pipeline:
  - one SVG share card per built-in celebration
  - one static share page per built-in celebration under `/share/<slug>/`
  - OpenGraph and Twitter metadata for those share pages
- Generic OpenGraph metadata for the main app shell.
- A share panel in the app for celebration days.
- A lightweight yearly statistics panel that summarizes:
  - total celebration days
  - busiest month
  - top category
  - strongest dates

## Main files

- `fredagskoll-frontend/src/features/shareability/shareCatalog.ts`
- `fredagskoll-frontend/src/features/shareability/shareability.ts`
- `fredagskoll-frontend/src/features/shareability/celebrationStats.ts`
- `fredagskoll-frontend/src/components/SharePanel.tsx`
- `fredagskoll-frontend/src/components/CelebrationStatsPanel.tsx`
- `fredagskoll-frontend/scripts/generate-share-assets.ts`
- `fredagskoll-frontend/scripts/write-build-info.js`

## Notes

- The implementation stays compatible with the current free-tier static setup.
- The share pages are generated during build and do not require SSR.
- The generated files under `public/share/` and `public/generated/` are build output, not
  source-of-truth files.
