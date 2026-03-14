# Fredagskoll Agent Notes

## Scope
- This repo contains a small full-stack app with a .NET 8 API in `Fredagskoll.Api`, a React + TypeScript frontend in `fredagskoll-frontend`, and a small media-generation tool in `tools/MeatWednesdayGifGen`.

## Runbook
- Run the backend from the repo root with `dotnet run --project Fredagskoll.Api`.
- Run the frontend from `fredagskoll-frontend` with `npm start`.
- The frontend currently calls `http://localhost:5166/friday`, so keep backend port expectations aligned with `launchSettings.json` and frontend fetch usage.

## Cross-file conventions
- Day-specific behavior is split across the API response shape and the frontend render branches. If you add or rename a weekday or special day, update both `Fredagskoll.Api/Controllers/FridayController.cs` and `fredagskoll-frontend/src/App.tsx`.
- Keep the frontend test expectations aligned with the API payload shape. The current test stubs the weekday flags directly.
- Media files such as `.gif`, `.png`, `.jpg`, and `.webp` are intentionally committed because they are part of the app experience.

## Media tool
- `tools/MeatWednesdayGifGen` generates animated assets from a source image using ImageSharp. Prefer extending that tool instead of rewriting ad hoc media-generation code in the app.

## Change discipline
- Favor small, explicit changes. This project is simple enough that extra abstraction usually adds more maintenance cost than value.
