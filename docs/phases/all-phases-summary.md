# Roadmap Delivery Summary

This file tracks the work completed across Phase 2 through Phase 5 on the current branch chain.

## Phase 2

- Added surprise-date picking based on celebration score
- Added celebration scoring and category labels
- Added `Dagens ursäkt att fika`
- Added a dedicated engagement panel in the main column
- Documented the phase in `docs/phases/phase-2.md`

## Phase 3

- Added shareable celebration URLs and generated share cards
- Added static share pages with OpenGraph and Twitter metadata
- Added a share panel to the app
- Added yearly celebration statistics in the UI
- Documented the phase in `docs/phases/phase-3.md`

## Phase 4

- Added a managed public celebration API:
  - `/api/celebrations/today`
  - `/api/celebrations/{date}`
  - `/api/celebrations/upcoming`
- Added a chat-friendly integration endpoint:
  - `/api/integrations/chat/celebrate`
- Added generated `.ics` export for the Swedish public calendar
- Added footer links to the public API and calendar export
- Documented the integration surface in `docs/integrations.md`
- Documented the phase in `docs/phases/phase-4.md`

## Phase 5

- Turned the app into an installable PWA baseline:
  - manifest cleanup
  - service worker
  - install prompt support
- Expanded the integration layer to support more than one celebration dataset
- Added an `en-US` dataset on top of the existing `sv-SE` dataset
- Extended API and chat endpoints with `dataset` support
- Added generated `.ics` exports for both `sv-SE` and `en-US`
- Documented the phase in `docs/phases/phase-5.md`

## Validation

The current working tree has been checked with:

- frontend build
- focused frontend test slices
- API node tests for the generated celebration dataset and chat endpoint

This summary should be updated again when the branch chain is eventually committed and merged.
