# Phase 4 - Integrations

Status: in progress

GitHub issues:
- `#80` Create a public celebration API
- `#84` Add a Slack / Discord celebration bot
- `#85` Add calendar export (.ics) for celebrations

## What has been implemented

- A generated public celebration dataset in `api/shared/generated/public-celebrations.json`
- Managed API routes for:
  - `GET /api/celebrations/today`
  - `GET /api/celebrations/{date}`
  - `GET /api/celebrations/upcoming`
- A chat-oriented integration endpoint:
  - `GET|POST /api/integrations/chat/celebrate`
- A generated `.ics` export for the public celebration calendar:
  - `/exports/vadkanmanfira-public.ics`
- Footer links in the app for:
  - the public API
  - the calendar export
- Integration docs in `docs/integrations.md`

## Main files

- `fredagskoll-frontend/scripts/generate-integration-assets.ts`
- `api/shared/publicCelebrations.js`
- `api/celebrations-today/`
- `api/celebrations-by-date/`
- `api/celebrations-upcoming/`
- `api/integrations-chat-celebrate/`
- `docs/integrations.md`

## Notes

- The implementation stays on the existing free-tier setup.
- The managed API reads generated build data instead of duplicating celebration rules in Node.
- The chat endpoint is deliberately simple and acts as a bridge target for Slack/Discord style integrations rather than a fully hosted bot product on its own.
