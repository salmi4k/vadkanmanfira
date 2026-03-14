# Fredagskoll

Fredagskoll is being simplified into a frontend-only app that checks whether a
date deserves celebration.

## Current day logic

- `allahjartansdag`: February 14
- `fettisdag`: only on the real Fettisdag date for that year
- `vaffeldagen`: March 25
- `valborg`: April 30
- `kanelbullensdag`: October 4
- `kladdkakansdag`: November 7
- `lucia`: December 13
- `kottonsdag`: every Wednesday
- `fisktorsdag`: every Thursday
- `marmeladfredag`: every Friday
- ordinary days: no special celebration

## Run the frontend

```sh
cd fredagskoll-frontend
npm start
```

## Direction

- keep weekday and celebration rules in the frontend
- add more Swedish celebratory dates that can actually show up during work life
- improve the visual design without bloating the app
