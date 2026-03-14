import { getCelebrationThemeAliases, getCelebrations } from './celebrations';
import {
  ContentPack,
  getActiveContentPack,
  getRecurringWeekdayTypes,
  isTeamWeekdayDayType,
} from './contentPack';
import {
  DayType,
  OfficialHoliday,
  getDayStatus,
  getOfficialHolidays,
} from './dayLogic';
import { Locale, translateOfficialHolidayName, translateThemeDayName } from './locale';
import { getThemeDaysForDate } from './temadagar';
import { joinWithAnd } from './themeDayBlurbs';

type UpcomingNotableKind = 'holiday' | 'celebration' | 'themeday';

export interface UpcomingNotable {
  date: Date;
  dateLabel: string;
  daysUntil: number;
  kind: UpcomingNotableKind;
  label: string;
  title: string;
  note: string;
}

type TimingTemplates = {
  waitsTomorrow: string;
  waitsInDays: (days: number) => string;
  arrivesTomorrow: string;
  arrivesInDays: (days: number) => string;
  comesTomorrow: string;
  comesInDays: (days: number) => string;
  liesAheadTomorrow: string;
  liesAheadInDays: (days: number) => string;
};

type UpcomingCopySet = {
  labels: {
    holiday: string;
    celebration: string;
    themeDay: string;
    themeDays: (count: number) => string;
  };
  timing: TimingTemplates;
  notes: {
    holidayWithExtras: string[];
    holidaySolo: string;
    celebrationWithExtras: string[];
    celebrationSolo: string[];
    themeDayWithExtras: string[];
    themeDaySolo: string[];
  };
};

const upcomingCopyByLocale: Record<Locale, UpcomingCopySet> = {
  sv: {
    labels: {
      holiday: 'Helgdag',
      celebration: 'Firardag',
      themeDay: 'Temadag',
      themeDays: (count: number) => `Temadagar x${count}`,
    },
    timing: {
      waitsTomorrow: 'väntar i morgon',
      waitsInDays: (days: number) => `väntar om ${days} dagar`,
      arrivesTomorrow: 'dyker upp i morgon',
      arrivesInDays: (days: number) => `dyker upp om ${days} dagar`,
      comesTomorrow: 'kommer i morgon',
      comesInDays: (days: number) => `kommer om ${days} dagar`,
      liesAheadTomorrow: 'ligger i morgon',
      liesAheadInDays: (days: number) => `ligger ${days} dagar bort`,
    },
    notes: {
      holidayWithExtras: [
        '{title} {arrives}, och {extras} skramlar med på köpet.',
        '{title} {waits}. Som bonus har även {extras} lyckats klämma sig in i samma datum.',
        '{title} {comes}, och {extras} hänger på som ett märkligt litet förband.',
        '{title} {liesAhead}. Samtidigt vägrar {extras} att hålla en låg profil.',
      ],
      holidaySolo:
        '{title} {arrives}, så veckan har åtminstone ett officiellt alibi på väg.',
      celebrationWithExtras: [
        '{title} {waits}. Samtidigt smyger {extras} runt i bakgrunden och vill också bli sedd.',
        '{title} {arrives}, och {extras} tänker tydligen inte stå tyst bredvid.',
        '{title} {comes}. Som vanligt räckte inte det, så {extras} har också lagt sig i.',
        '{title} {liesAhead}, medan {extras} fladdrar runt som bonusmaterial ingen bett om men ändå får.',
        '{title} {waits}, och {extras} står redan där och fingrar på ridån.',
        '{title} {comes}. Dessutom har {extras} bestämt sig för att dela strålkastaren.',
      ],
      celebrationSolo: [
        '{title} {waits}, vilket ändå är bättre än att blicka rakt in i rå vardag.',
        '{title} {arrives}, och veckan får därmed något som åtminstone liknar personlighet.',
        '{title} {comes}. Det är inte storslaget kanske, men det slår absolut kalendermässigt dödläge.',
        '{title} {liesAhead}, vilket räcker för att hela veckan ska kännas marginellt mindre grå.',
      ],
      themeDayWithExtras: [
        '{title} {waits}, och {extras} klamrar sig också fast vid datumet.',
        '{title} {arrives}. Dessutom lyckades {extras} få plats i samma lilla kalenderspricka.',
        '{title} {liesAhead}, och {extras} tänker tydligen inte lämna scenen ensam.',
        '{title} {comes}. Som om det inte räckte så hasar även {extras} in från sidan.',
      ],
      themeDaySolo: [
        '{title} {waits}. Kalendern försöker åtminstone se mindre livlös ut än vanligt.',
        '{title} {arrives}, vilket är oväntat mycket personlighet för ett helt vanligt datum.',
        '{title} {waits}. Det är exakt den sortens smala värdighet man får arbeta med ibland.',
        '{title} {comes}, och det är ändå mer kultur än veckan först gav sken av.',
        '{title} {liesAhead}. Smalt, ja, men fortfarande märkbart bättre än total kalendertorka.',
        '{title} {waits}. Någon tog sig tid att ge datumet en egen liten nisch, och det får man respektera.',
      ],
    },
  },
  en: {
    labels: {
      holiday: 'Holiday',
      celebration: 'Celebration',
      themeDay: 'Theme day',
      themeDays: (count: number) => `Theme days x${count}`,
    },
    timing: {
      waitsTomorrow: 'waits tomorrow',
      waitsInDays: (days: number) => `waits in ${days} days`,
      arrivesTomorrow: 'shows up tomorrow',
      arrivesInDays: (days: number) => `shows up in ${days} days`,
      comesTomorrow: 'arrives tomorrow',
      comesInDays: (days: number) => `arrives in ${days} days`,
      liesAheadTomorrow: 'sits there tomorrow',
      liesAheadInDays: (days: number) => `sits ${days} days ahead`,
    },
    notes: {
      holidayWithExtras: [
        '{title} {arrives}, and {extras} comes rattling along with it.',
        '{title} {waits}. As a bonus, {extras} also managed to squeeze into the same date.',
        '{title} {comes}, and {extras} tags along like a strange little opening act.',
        '{title} {liesAhead}. Meanwhile, {extras} refuses to keep a low profile.',
      ],
      holidaySolo:
        '{title} {arrives}, so the week at least has one official breach in the wall coming.',
      celebrationWithExtras: [
        '{title} {waits}. At the same time, {extras} is already lurking in the background demanding to be seen.',
        '{title} {arrives}, and {extras} clearly has no intention of standing quietly off to the side.',
        '{title} {comes}. As usual that was not enough, so {extras} has inserted itself as well.',
        '{title} {liesAhead}, while {extras} flutters around like bonus material no one requested but still gets.',
        '{title} {waits}, and {extras} is already there fingering the curtain.',
        '{title} {comes}. On top of that, {extras} has decided it deserves a share of the spotlight.',
      ],
      celebrationSolo: [
        '{title} {waits}, which is still better than staring straight into raw weekday matter.',
        '{title} {arrives}, and the week therefore acquires something faintly resembling personality.',
        '{title} {comes}. Not monumental, perhaps, but still vastly better than calendar deadlock.',
        '{title} {liesAhead}, which is enough to make the whole week feel marginally less grey.',
      ],
      themeDayWithExtras: [
        '{title} {waits}, and {extras} is also clinging stubbornly to the date.',
        '{title} {arrives}. On top of that, {extras} somehow secured room in the same tiny calendar crack.',
        '{title} {liesAhead}, and {extras} apparently has no intention of leaving the stage alone.',
        '{title} {comes}. As if that were not enough, {extras} also shuffles in from the side.',
      ],
      themeDaySolo: [
        '{title} {waits}. The calendar is at least trying to look less lifeless than usual.',
        '{title} {arrives}, which is an unexpectedly large amount of personality for an otherwise ordinary date.',
        '{title} {waits}. Exactly the sort of narrow little dignity one has to work with sometimes.',
        '{title} {comes}, and that is still more culture than the week first suggested.',
        '{title} {liesAhead}. Niche, yes, but still markedly better than total calendar drought.',
        '{title} {waits}. Someone took the trouble to give the date its own little niche, and one has to respect that.',
      ],
    },
  },
  'pt-BR': {
    labels: {
      holiday: 'Feriado',
      celebration: 'Comemoração',
      themeDay: 'Dia temático',
      themeDays: (count: number) => `Dias temáticos x${count}`,
    },
    timing: {
      waitsTomorrow: 'espera amanhã',
      waitsInDays: (days: number) => `espera em ${days} dias`,
      arrivesTomorrow: 'aparece amanhã',
      arrivesInDays: (days: number) => `aparece em ${days} dias`,
      comesTomorrow: 'chega amanhã',
      comesInDays: (days: number) => `chega em ${days} dias`,
      liesAheadTomorrow: 'está logo ali amanhã',
      liesAheadInDays: (days: number) => `está a ${days} dias de distância`,
    },
    notes: {
      holidayWithExtras: [
        '{title} {arrives}, e {extras} vem no embalo, para a alegria de ninguém.',
        '{title} {waits}. Como bônus, {extras} conseguiu enfiar o pé na mesma data - não que alguém tenha pedido.',
        '{title} {comes}, e {extras} aparece meio sem jeito como aquele ato estranho no show principal.',
        '{title} {liesAhead}. Enquanto isso, {extras} teima em roubar a cena, claro.',
      ],
      holidaySolo:
        '{title} {arrives}, pelo menos a semana ganha uma desculpa oficial para existir.',
      celebrationWithExtras: [
        '{title} {waits}. E, como se não bastasse, {extras} já está ali no canto querendo atenção.',
        '{title} {arrives}, e {extras} claramente não vai ficar só no sofá dessa vez.',
        '{title} {comes}. Como sempre, não foi suficiente, então {extras} resolveu se meter também.',
        '{title} {liesAhead}, enquanto {extras} voa por aí igual bônus indesejado, mas que apareceu mesmo assim.',
        '{title} {waits}, e {extras} já está ali cutucando a cortina, esperando o show começar.',
        '{title} {comes}. Além disso, {extras} decidiu que merece uma fatia do holofote.',
      ],
      celebrationSolo: [
        '{title} {waits}, o que já é melhor do que encarar uma semana sem graça.',
        '{title} {arrives}, e a semana ganha pelo menos uma cara menos entediante.',
        '{title} {comes}. Nada épico, mas já quebra o silêncio sepulcral do calendário.',
        '{title} {liesAhead}, o suficiente para deixar a semana um tiquinho menos cinza.',
      ],
      themeDayWithExtras: [
        '{title} {waits}, e {extras} se agarra ao dia feito chiclete no sapato.',
        '{title} {arrives}. Para completar, {extras} milagrosamente entrou na brecha do calendário.',
        '{title} {liesAhead}, e {extras} claramente não pretende sair de cena sozinho.',
        '{title} {comes}. Como se não bastasse, {extras} aparece mancando por ali também.',
      ],
      themeDaySolo: [
        '{title} {waits}. Pelo menos o calendário tenta parecer menos morto do que o normal.',
        '{title} {arrives}, uma quantidade surpreendente de personalidade para um dia justamente comum.',
        '{title} {waits}. Exatamente o tipo de dignidade modesta que se aprende a apreciar.',
        '{title} {comes}, e isso já é mais cultura do que a semana sugeria inicialmente.',
        '{title} {liesAhead}. Nicho, sim, mas bem melhor do que aquele deserto no calendário.',
        '{title} {waits}. Alguém se deu ao trabalho de dar um cantinho especial para a data, respeita.',
      ],
    },
  },
};

function toLocalDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getOfficialHolidayForDate(date: Date): OfficialHoliday | null {
  return (
    getOfficialHolidays(date.getFullYear()).find(
      (holiday) => holiday.dateLabel === formatDate(date)
    ) ?? null
  );
}

function getCelebrationDisplayName(
  dayType: Exclude<DayType, 'ordinary'>,
  locale: Locale,
  contentPack: ContentPack
): string {
  const celebrations = getCelebrations(locale, contentPack);
  const aliases = getCelebrationThemeAliases(dayType, locale, contentPack);
  if (aliases.length > 0) {
    return aliases[0];
  }

  return celebrations[dayType].title.split('.')[0];
}

function pickCopyVariant(seed: string, options: string[]): string {
  const value = seed.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return options[value % options.length];
}

function getTimingPhrases(daysUntil: number, locale: Locale) {
  const timing = upcomingCopyByLocale[locale].timing;

  return {
    waits: daysUntil === 1 ? timing.waitsTomorrow : timing.waitsInDays(daysUntil),
    arrives: daysUntil === 1 ? timing.arrivesTomorrow : timing.arrivesInDays(daysUntil),
    comes: daysUntil === 1 ? timing.comesTomorrow : timing.comesInDays(daysUntil),
    liesAhead:
      daysUntil === 1 ? timing.liesAheadTomorrow : timing.liesAheadInDays(daysUntil),
  };
}

function interpolate(
  template: string,
  values: Record<'title' | 'extras' | 'waits' | 'arrives' | 'comes' | 'liesAhead', string>
): string {
  return template
    .replaceAll('{title}', values.title)
    .replaceAll('{extras}', values.extras)
    .replaceAll('{waits}', values.waits)
    .replaceAll('{arrives}', values.arrives)
    .replaceAll('{comes}', values.comes)
    .replaceAll('{liesAhead}', values.liesAhead);
}

function getUpcomingNote(
  kind: UpcomingNotableKind,
  title: string,
  daysUntil: number,
  extras: string[],
  locale: Locale
): string {
  const copy = upcomingCopyByLocale[locale];
  const timing = getTimingPhrases(daysUntil, locale);
  const values = {
    title,
    extras: joinWithAnd(extras, locale).toLowerCase(),
    waits: timing.waits,
    arrives: timing.arrives,
    comes: timing.comes,
    liesAhead: timing.liesAhead,
  };

  if (kind === 'holiday') {
    if (extras.length > 0) {
      return interpolate(
        pickCopyVariant(`${title}-${daysUntil}-holiday-extras-${locale}`, copy.notes.holidayWithExtras),
        values
      );
    }

    return interpolate(copy.notes.holidaySolo, values);
  }

  if (kind === 'celebration') {
    if (extras.length > 0) {
      return interpolate(
        pickCopyVariant(
          `${title}-${daysUntil}-celebration-extras-${locale}`,
          copy.notes.celebrationWithExtras
        ),
        values
      );
    }

    return interpolate(
      pickCopyVariant(`${title}-${daysUntil}-celebration-${locale}`, copy.notes.celebrationSolo),
      values
    );
  }

  if (extras.length > 0) {
    return interpolate(
      pickCopyVariant(`${title}-${daysUntil}-themeday-extras-${locale}`, copy.notes.themeDayWithExtras),
      values
    );
  }

  return interpolate(
    pickCopyVariant(`${title}-${daysUntil}-themeday-${locale}`, copy.notes.themeDaySolo),
    values
  );
}

export function getUpcomingNotables(
  inputDate: Date,
  maxItems = 4,
  lookaheadDays = 21,
  locale: Locale = 'sv',
  contentPack: ContentPack = getActiveContentPack()
): UpcomingNotable[] {
  const startDate = toLocalDateOnly(inputDate);
  const priorityItems: UpcomingNotable[] = [];
  const secondaryItems: UpcomingNotable[] = [];
  const recurringWeekdayTypes = getRecurringWeekdayTypes(contentPack);

  for (let offset = 1; offset <= lookaheadDays; offset += 1) {
    const date = toLocalDateOnly(addDays(startDate, offset));
    const dateLabel = formatDate(date);
    const officialHoliday = getOfficialHolidayForDate(date);
    const dayStatus = getDayStatus(date, contentPack);
    const hasMajorCelebration =
      dayStatus.dayType !== 'ordinary' &&
      !(isTeamWeekdayDayType(dayStatus.dayType) && recurringWeekdayTypes.includes(dayStatus.dayType));
    const themeDays = getThemeDaysForDate(date);

    if (!officialHoliday && !hasMajorCelebration && themeDays.length === 0) {
      continue;
    }

    let kind: UpcomingNotableKind;
    let label: string;
    let title: string;

    if (officialHoliday) {
      kind = 'holiday';
      label = upcomingCopyByLocale[locale].labels.holiday;
      title = translateOfficialHolidayName(officialHoliday.name, locale);
    } else if (hasMajorCelebration) {
      const celebrationDayType = dayStatus.dayType as Exclude<DayType, 'ordinary'>;
      kind = 'celebration';
      label = upcomingCopyByLocale[locale].labels.celebration;
      title = getCelebrationDisplayName(celebrationDayType, locale, contentPack);
    } else {
      kind = 'themeday';
      label =
        themeDays.length > 1
          ? upcomingCopyByLocale[locale].labels.themeDays(themeDays.length)
          : upcomingCopyByLocale[locale].labels.themeDay;
      title = translateThemeDayName(themeDays[0], locale);
    }

    const extras = themeDays
      .map((themeDay) => translateThemeDayName(themeDay, locale))
      .filter((themeDay) => themeDay !== title)
      .slice(0, 2);

    const item = {
      date,
      dateLabel,
      daysUntil: offset,
      kind,
      label,
      title,
      note: getUpcomingNote(kind, title, offset, extras, locale),
    };

    if (kind === 'themeday') {
      secondaryItems.push(item);
    } else {
      priorityItems.push(item);
    }
  }

  return [...priorityItems, ...secondaryItems].slice(0, maxItems);
}
