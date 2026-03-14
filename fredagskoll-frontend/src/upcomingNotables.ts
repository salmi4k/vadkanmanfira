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

function getUpcomingNote(
  kind: UpcomingNotableKind,
  title: string,
  daysUntil: number,
  extras: string[]
): string {
  const timing = daysUntil === 1 ? 'i morgon' : `om ${daysUntil} dagar`;

  if (kind === 'holiday') {
    if (extras.length > 0) {
      return `${title} dyker upp ${timing}, och ${joinWithAnd(
        extras
      ).toLowerCase()} skramlar med på köpet.`;
    }

    return `${title} dyker upp ${timing}, så veckan har åtminstone ett officiellt alibi på väg.`;
  }

  if (kind === 'celebration') {
    if (extras.length > 0) {
      return `${title} väntar ${timing}. Dessutom pågår ${joinWithAnd(
        extras
      ).toLowerCase()} i kulissen.`;
    }

    return `${title} väntar ${timing}, vilket ändå är bättre än att blicka rakt in i rå vardag.`;
  }

  return `${title} väntar ${timing}. Det är inte officiellt, men det är mer än kalendern brukar bjuda på.`;
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
