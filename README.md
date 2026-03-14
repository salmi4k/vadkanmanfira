# Fredagskoll

A fullstack project to check if a given day (in Sweden/Swedish) is a Friday.

## Backend (.NET 8 Web API)
- Endpoint: `/friday?date=YYYY-MM-DD` (date optional, defaults to today)
- Returns: `{ isFriday: true/false, date: "YYYY-MM-DD" }`
- CORS enabled for frontend development

### Run backend
```sh
dotnet run --project Fredagskoll.Api
```

## Frontend (React + TypeScript)
- Asks for a date (or uses today)
- Calls backend to check if it’s Friday
- If Friday: shows a special page (placeholder for now)
- If not: shows “nej, idag är det inte fredag :/”

### Run frontend
```sh
cd fredagskoll-frontend
npm start
```

## Setup
1. Start backend: `dotnet run --project Fredagskoll.Api`
2. Start frontend: `cd fredagskoll-frontend && npm start`

---
Replace placeholder content on the frontend for Fridays with your own gifs/pictures as needed.
