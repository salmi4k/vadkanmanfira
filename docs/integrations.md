# Integrations

The app now exposes a lightweight integration surface that stays compatible with the current free-tier setup.

## Public celebration API

All endpoints are served from the managed Static Web Apps API.

### `GET /api/celebrations/today`

Returns the celebration entry for the current date.

Optional query params:
- `locale=sv|en|pt-BR`
- `dataset=sv-SE|en-US`

### `GET /api/celebrations/{date}`

Returns the celebration entry for a specific date in `YYYY-MM-DD` format.

Optional query params:
- `locale=sv|en|pt-BR`
- `dataset=sv-SE|en-US`

### `GET /api/celebrations/upcoming`

Returns upcoming celebration dates from the generated public dataset.

Optional query params:
- `from=YYYY-MM-DD`
- `limit=1..30`
- `locale=sv|en|pt-BR`
- `dataset=sv-SE|en-US`

## Chat integration endpoint

### `GET|POST /api/integrations/chat/celebrate`

This endpoint turns a celebration entry into chat-friendly output.

Supported params:
- `date=YYYY-MM-DD`
- `locale=sv|en|pt-BR`
- `dataset=sv-SE|en-US`
- `platform=text|digest|json-card|slack|slack-blocks|teams|discord`

Response shapes:
- `platform=text`
  - `{ "text": "...", "links": { "appUrl": "...", "shareUrl": "...", "shareCardUrl": "..." } }`
- `platform=digest`
  - canonical low-cost daily object for automation
  - includes headline, detail lines, primary celebration metadata, links, and next notable date
- `platform=json-card`
  - alias for `digest` when the consuming system expects a machine-facing card object rather than prose
- `platform=slack`
  - `{ "response_type": "in_channel", "text": "..." }`
- `platform=slack-blocks`
  - Slack block-kit payload with buttons for the day page and share card
- `platform=teams`
  - Adaptive Card style payload with the same day object and actions
- `platform=discord`
  - `{ "content": "..." }`

This is intentionally lightweight. It is meant to be easy to adapt into slash-command, webhook, or scheduled-post flows later, not to pretend we already built a full bot platform.

The product stance should stay opinionated across every surface:

- one daily verdict worth sending
- one elegant card worth posting
- one deep link back to the exact day

That matters more than shipping a long list of integration toggles.

Recommended free-tier usage:

- use `platform=digest` for scheduled jobs, email, widgets, or external automation
- use `platform=slack-blocks` and `platform=teams` at the final presentation edge
- avoid calling the AI path from every integration request; prefer cached AI plus generated celebration data

## Calendar export

The public pack also generates a static `.ics` file during build:

- `/exports/vadkanmanfira-public.ics`
- `/exports/vadkanmanfira-sv-SE.ics`
- `/exports/vadkanmanfira-en-US.ics`

It currently covers the generated public celebration range and can be imported into normal calendar apps.

## Source of truth

The integration surfaces are generated from the same celebration rule model used by the app itself. A build step writes:

- `api/shared/generated/public-celebrations.json`
- `fredagskoll-frontend/public/exports/vadkanmanfira-public.ics`

That keeps the API, chat output, and calendar export aligned with the actual date logic instead of creating separate hand-maintained copies.

The generated dataset bundle currently includes:

- `sv-SE`
- `en-US`
