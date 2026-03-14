import { Locale } from './locale';

export const ordinaryThemeDayTitleEndingsByLocale: Record<Locale, string[]> = {
  sv: [
    'Det får väl bära dagen då.',
    'Det är åtminstone något att skylla på.',
    'Kontoret får helt enkelt acceptera saken.',
    'Det är mer än kalendern brukar erbjuda.',
    'Det blir inte bättre än så här idag.',
    'Det får duga som dagens professionella ursäkt.',
    'Vi tar det och går vidare.',
    'Det är i alla fall bättre än ren tomhet.',
  ],
  en: [
    'That will have to carry the day, then.',
    "At least it's something to blame it on.",
    'The office will simply have to accept it.',
    "It's more than the calendar usually offers.",
    "This is about as good as today's getting.",
    "It'll do as today's professional excuse.",
    "We'll take it and move on.",
    "It's still better than pure emptiness.",
  ],
};

export const ordinaryThemeDayCardNotesByLocale: Record<Locale, string[]> = {
  sv: [
    'Det är inte officiellt, men tillräckligt många har uppenbarligen bestämt sig för att göra något av det här datumet.',
    'Kalendern får arbeta med det material den har, och idag blev det ändå förvånansvärt dugligt.',
    'Det här är inte statsbärande direkt, men absolut tillräckligt för att spela lite större än datumet först såg ut.',
    'Ingen regering står bakom det här, men folk har ändå visat den goda smaken att fylla dagen med något märkbart.',
    'Det är smalt, löst sammanhållet och fullt tillräckligt för att ge datumet någon sorts ryggrad.',
    'Officiellt är det tunt. Inofficiellt är det ändå nog för att låta dagen slippa total förnedring.',
    'Någon tog sig tid att ge dagen innehåll, och det vore småaktigt att inte arbeta vidare på det.',
    'Det här får duga som folkligt initiativ. Inte majestätiskt, men klart bättre än kalendermässig öken.',
  ],
  en: [
    "It's not official, but clearly enough people decided this date deserved some sort of content.",
    'The calendar has to work with the material available, and today it ended up with something surprisingly serviceable.',
    "This isn't exactly state-bearing, but it's absolutely enough to make the date play slightly above its station.",
    "No government stands behind this, but people still had the good judgment to give the day some visible substance.",
    "It's niche, loosely assembled, and still more than enough to give the date some kind of spine.",
    "Officially it's thin. Unofficially it's enough to spare the day total humiliation.",
    'Someone took the trouble to give the day some content, and it would be petty not to build on that.',
    "This will do as a piece of public initiative. Not majestic, but clearly better than calendar desert.",
  ],
};

export const appText = {
  sv: {
    languageButton: 'English',
    darkMode: 'Mörkt läge',
    lightMode: 'Ljust läge',
    eyebrow: 'Fredagskoll deluxe',
    title: 'Vad firar vi idag?',
    lede:
      'Välj ett datum och låt appen avgöra om dagen förtjänar sill, semla, fisk eller bara ett tyst konstaterande av tomhet.',
    pickDate: 'Välj datum',
    nameday: 'Dagens namnsdag',
    namedayLoading: 'Laddar namnsdag från öppet API.',
    namedayError:
      'Namnsdag gick inte att hämta just nu. Internet måste förstås också vilja samarbeta.',
    namedayNone: 'Ingen namnsdag registrerad för datumet.',
    weeklyHoliday: 'Veckans helgdag',
    nowCard: 'Säsongen pågår',
    upcoming: 'På gång',
    imageCredits: 'Bildkällor',
    themeDaySource: 'Temadagar inspirerade av temadagar.se',
    previousDay: 'Föregående dag',
    nextDay: 'Nästa dag',
    reroll: 'Ny ursäkt',
    unofficialThemeDay: 'Inofficiell temadag',
    unofficialThemeDays: (count: number) => `Inofficiella temadagar x${count}`,
    noOfficialEnergy: 'Ingen officiell stordådskänsla',
    ordinaryTitle: 'En vanlig dag. Så sorgligt är det.',
    extraThemeDays: 'Fler temadagar idag',
    asIfThatWasNotEnough: (leadDay: string, days: string) =>
      `Som om ${leadDay.toLowerCase()} inte räckte, så pågår även ${days} i bakgrunden.`,
    noImageBadge: 'Bildfri zon',
    noImageTitle: 'Det här firandet får bära sig självt utan fotobevis.',
    noImageBody:
      'Ingen bild finns än, men dagen försöker i alla fall inte se tom ut längre.',
    todayThemeDays: 'Dagens temadagar',
    noHit: 'Ingen träff',
    ordinaryThemeDayLead: (days: string, note: string) =>
      `Temadagsmotorn hittade ${days}. ${note}`,
    ordinaryNoHitBody:
      'Datumet har kollats. Systemet fann ingen semla, ingen sill, ingen bullplikt och ingen kollektiv ursäkt för att tappa fokus.',
    close: 'Stäng',
    creditsEyebrow: 'Bildkällor',
    creditsTitle: 'Wikimedia Commons-credits',
    creditsLead:
      'De nedladdade Commons-bilderna är publikt krediterade här med skapare, källsida och licens. Bilderna i appen är nedskalade versioner.',
    creator: 'Skapare',
    license: 'Licens',
    source: 'Källa',
    commonsFilePage: 'Commons-filsida',
    upcomingTomorrow: 'I morgon',
    upcomingInDays: (days: number) => `Om ${days} dagar`,
    seasonLabel: 'Säsong',
  },
  en: {
    languageButton: 'Svenska',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    eyebrow: 'Fredagskoll deluxe',
    title: "What's the occasion today?",
    lede:
      'Pick a date and let the app decide whether it calls for herring, semla, fish, or just a quiet acknowledgement of emptiness.',
    pickDate: 'Choose date',
    nameday: "Today's name day",
    namedayLoading: 'Loading name day from the open API.',
    namedayError:
      'The name day lookup failed for now. The internet, naturally, also has to feel like cooperating.',
    namedayNone: 'No registered name day for this date.',
    weeklyHoliday: "This Week's Holiday",
    nowCard: 'Season in progress',
    upcoming: 'Coming up',
    imageCredits: 'Image credits',
    themeDaySource: 'Theme days inspired by temadagar.se',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    reroll: 'New excuse',
    unofficialThemeDay: 'Unofficial theme day',
    unofficialThemeDays: (count: number) => `Unofficial theme days x${count}`,
    noOfficialEnergy: 'No official sense of occasion',
    ordinaryTitle: 'Just an ordinary day. Grim stuff.',
    extraThemeDays: 'More theme days today',
    asIfThatWasNotEnough: (leadDay: string, days: string) =>
      `As if ${leadDay.toLowerCase()} was not enough, ${days} is also rattling around in the background.`,
    noImageBadge: 'Image-free zone',
    noImageTitle: 'This celebration will have to carry itself without photographic proof.',
    noImageBody:
      "There isn't an image yet, but at least the day no longer has to sit there looking empty.",
    todayThemeDays: "Today's theme days",
    noHit: 'No hit',
    ordinaryThemeDayLead: (days: string, note: string) =>
      `The theme-day engine found ${days}. ${note}`,
    ordinaryNoHitBody:
      'The date has been checked. The system found no semla, no herring, no bun obligation, and no collective excuse to lose focus.',
    close: 'Close',
    creditsEyebrow: 'Image credits',
    creditsTitle: 'Wikimedia Commons credits',
    creditsLead:
      'Downloaded Commons images are publicly credited here with creator, source page, and license. The versions in the app are downscaled.',
    creator: 'Creator',
    license: 'License',
    source: 'Source',
    commonsFilePage: 'Commons file page',
    upcomingTomorrow: 'Tomorrow',
    upcomingInDays: (days: number) => `In ${days} days`,
    seasonLabel: 'Season',
  },
} as const;
