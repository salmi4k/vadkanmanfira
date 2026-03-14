import { celebrations, getCelebrationThemeAliases } from './celebrations';
import {
  DayType,
  OfficialHoliday,
  getDayStatus,
  getOfficialHolidays,
} from './dayLogic';
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

const recurringWeekdayTypes: DayType[] = ['kottonsdag', 'fisktorsdag', 'marmeladfredag'];

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

function getCelebrationDisplayName(dayType: Exclude<DayType, 'ordinary'>): string {
  const aliases = getCelebrationThemeAliases(dayType);
  if (aliases.length > 0) {
    return aliases[0];
  }

  return celebrations[dayType].title.split('.')[0];
}

function pickCopyVariant(seed: string, options: string[]): string {
  const value = seed.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return options[value % options.length];
}

function getWaitsPhrase(daysUntil: number): string {
  return daysUntil === 1 ? 'väntar i morgon' : `väntar om ${daysUntil} dagar`;
}

function getArrivesPhrase(daysUntil: number): string {
  return daysUntil === 1 ? 'dyker upp i morgon' : `dyker upp om ${daysUntil} dagar`;
}

function getComesPhrase(daysUntil: number): string {
  return daysUntil === 1 ? 'kommer i morgon' : `kommer om ${daysUntil} dagar`;
}

function getLiesAheadPhrase(daysUntil: number): string {
  return daysUntil === 1 ? 'ligger i morgon' : `ligger ${daysUntil} dagar bort`;
}

function getUpcomingNote(
  kind: UpcomingNotableKind,
  title: string,
  daysUntil: number,
  extras: string[]
): string {
  const waitsPhrase = getWaitsPhrase(daysUntil);
  const arrivesPhrase = getArrivesPhrase(daysUntil);
  const comesPhrase = getComesPhrase(daysUntil);
  const liesAheadPhrase = getLiesAheadPhrase(daysUntil);

  if (kind === 'holiday') {
    if (extras.length > 0) {
      return pickCopyVariant(`${title}-${daysUntil}-holiday-extras`, [
        `${title} ${arrivesPhrase}, och ${joinWithAnd(
          extras
        ).toLowerCase()} skramlar med på köpet.`,
        `${title} ${waitsPhrase}. Som bonus har även ${joinWithAnd(
          extras
        ).toLowerCase()} lyckats klämma sig in i samma datum.`,
        `${title} ${comesPhrase}, och ${joinWithAnd(
          extras
        ).toLowerCase()} hänger på som ett märkligt litet förband.`,
        `${title} ${liesAheadPhrase}. Samtidigt vägrar ${joinWithAnd(
          extras
        ).toLowerCase()} att hålla en låg profil.`,
      ]);
    }

    return `${title} ${arrivesPhrase}, så veckan har åtminstone ett officiellt alibi på väg.`;
  }

  if (kind === 'celebration') {
    if (extras.length > 0) {
      return pickCopyVariant(`${title}-${daysUntil}-celebration-extras`, [
        `${title} ${waitsPhrase}. Samtidigt smyger ${joinWithAnd(
          extras
        ).toLowerCase()} runt i bakgrunden och vill också bli sedd.`,
        `${title} ${arrivesPhrase}, och ${joinWithAnd(
          extras
        ).toLowerCase()} tänker tydligen inte stå tyst bredvid.`,
        `${title} ${comesPhrase}. Som vanligt räckte inte det, så ${joinWithAnd(
          extras
        ).toLowerCase()} har också lagt sig i.`,
        `${title} ${liesAheadPhrase}, medan ${joinWithAnd(
          extras
        ).toLowerCase()} fladdrar runt som bonusmaterial ingen bett om men ändå får.`,
        `${title} ${waitsPhrase}, och ${joinWithAnd(
          extras
        ).toLowerCase()} står redan där och fingrar på ridån.`,
        `${title} ${comesPhrase}. Dessutom har ${joinWithAnd(
          extras
        ).toLowerCase()} bestämt sig för att dela strålkastaren.`,
      ]);
    }

    return pickCopyVariant(`${title}-${daysUntil}-celebration`, [
      `${title} ${waitsPhrase}, vilket ändå är bättre än att blicka rakt in i rå vardag.`,
      `${title} ${arrivesPhrase}, och veckan får därmed något som åtminstone liknar personlighet.`,
      `${title} ${comesPhrase}. Det är inte storslaget kanske, men det slår absolut kalendermässigt dödläge.`,
      `${title} ${liesAheadPhrase}, vilket räcker för att hela veckan ska kännas marginellt mindre grå.`,
    ]);
  }

  if (extras.length > 0) {
    return pickCopyVariant(`${title}-${daysUntil}-extras`, [
      `${title} ${waitsPhrase}, och ${joinWithAnd(extras).toLowerCase()} klamrar sig också fast vid datumet.`,
      `${title} ${arrivesPhrase}. Dessutom lyckades ${joinWithAnd(
        extras
      ).toLowerCase()} få plats i samma lilla kalenderspricka.`,
      `${title} ${liesAheadPhrase}, och ${joinWithAnd(
        extras
      ).toLowerCase()} tänker tydligen inte lämna scenen ensam.`,
      `${title} ${comesPhrase}. Som om det inte räckte så hasar även ${joinWithAnd(
        extras
      ).toLowerCase()} in från sidan.`,
    ]);
  }

  return pickCopyVariant(`${title}-${daysUntil}`, [
    `${title} ${waitsPhrase}. Kalendern försöker åtminstone se mindre livlös ut än vanligt.`,
    `${title} ${arrivesPhrase}, vilket är oväntat mycket personlighet för ett helt vanligt datum.`,
    `${title} ${waitsPhrase}. Det är exakt den sortens smala värdighet man får arbeta med ibland.`,
    `${title} ${comesPhrase}, och det är ändå mer kultur än veckan först gav sken av.`,
    `${title} ${liesAheadPhrase}. Smalt, ja, men fortfarande märkbart bättre än total kalendertorka.`,
    `${title} ${waitsPhrase}. Någon tog sig tid att ge datumet en egen liten nisch, och det får man respektera.`,
  ]);
}

export function getUpcomingNotables(
  inputDate: Date,
  maxItems = 4,
  lookaheadDays = 21
): UpcomingNotable[] {
  const startDate = toLocalDateOnly(inputDate);
  const priorityItems: UpcomingNotable[] = [];
  const secondaryItems: UpcomingNotable[] = [];

  for (let offset = 1; offset <= lookaheadDays; offset += 1) {
    const date = toLocalDateOnly(addDays(startDate, offset));
    const dateLabel = formatDate(date);
    const officialHoliday = getOfficialHolidayForDate(date);
    const dayStatus = getDayStatus(date);
    const hasMajorCelebration =
      dayStatus.dayType !== 'ordinary' && !recurringWeekdayTypes.includes(dayStatus.dayType);
    const themeDays = getThemeDaysForDate(date);

    if (!officialHoliday && !hasMajorCelebration && themeDays.length === 0) {
      continue;
    }

    let kind: UpcomingNotableKind;
    let label: string;
    let title: string;

    if (officialHoliday) {
      kind = 'holiday';
      label = 'Helgdag';
      title = officialHoliday.name;
    } else if (hasMajorCelebration) {
      const celebrationDayType = dayStatus.dayType as Exclude<DayType, 'ordinary'>;
      kind = 'celebration';
      label = 'Firardag';
      title = getCelebrationDisplayName(celebrationDayType);
    } else {
      kind = 'themeday';
      label = themeDays.length > 1 ? `Temadagar x${themeDays.length}` : 'Temadag';
      title = themeDays[0];
    }

    const extras = themeDays.filter((themeDay) => themeDay !== title).slice(0, 2);

    const item = {
      date,
      dateLabel,
      daysUntil: offset,
      kind,
      label,
      title,
      note: getUpcomingNote(kind, title, offset, extras),
    };

    if (kind === 'themeday') {
      secondaryItems.push(item);
    } else {
      priorityItems.push(item);
    }
  }

  return [...priorityItems, ...secondaryItems].slice(0, maxItems);
}
