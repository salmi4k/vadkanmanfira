import { ContentPack, getActiveContentPack } from './contentPack';
import {
  CelebrationDayType,
  getCelebrationDefinitions,
  getEasterSunday,
  getFettisdagDate,
  isMatchingCelebrationDate,
} from './features/celebrations/celebrationDefinitions';

export type DayType = 'ordinary' | CelebrationDayType;

export interface DayStatus {
  dateLabel: string;
  dayType: DayType;
}

export interface OfficialHoliday {
  date: Date;
  dateLabel: string;
  name: string;
}

function toLocalDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMidsommardagen(year: number): Date {
  return new Date(year, 5, 20 + ((6 - new Date(year, 5, 20).getDay() + 7) % 7));
}

function getAllaHelgonsDag(year: number): Date {
  return new Date(year, 9, 31 + ((6 - new Date(year, 9, 31).getDay() + 7) % 7));
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const offset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - offset);
  return toLocalDateOnly(result);
}

function endOfWeek(date: Date): Date {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return toLocalDateOnly(result);
}

export function getFettisdag(year: number): Date {
  return getFettisdagDate(year);
}

export function getOfficialHolidays(year: number): OfficialHoliday[] {
  const easterSunday = getEasterSunday(year);
  const holidays = [
    { date: new Date(year, 0, 1), name: 'Nyårsdagen' },
    { date: new Date(year, 0, 6), name: 'Trettondedag jul' },
    { date: subtractDays(easterSunday, 2), name: 'Långfredagen' },
    { date: easterSunday, name: 'Påskdagen' },
    { date: subtractDays(easterSunday, -1), name: 'Annandag påsk' },
    { date: new Date(year, 4, 1), name: 'Första maj' },
    { date: subtractDays(easterSunday, -39), name: 'Kristi himmelsfärdsdag' },
    { date: subtractDays(easterSunday, -49), name: 'Pingstdagen' },
    { date: new Date(year, 5, 6), name: 'Nationaldagen' },
    { date: getMidsommardagen(year), name: 'Midsommardagen' },
    { date: getAllaHelgonsDag(year), name: 'Alla helgons dag' },
    { date: new Date(year, 11, 25), name: 'Juldagen' },
    { date: new Date(year, 11, 26), name: 'Annandag jul' },
  ];

  return holidays
    .map((holiday) => ({
      ...holiday,
      date: toLocalDateOnly(holiday.date),
      dateLabel: formatDate(holiday.date),
    }))
    .sort((left, right) => left.date.getTime() - right.date.getTime());
}

export function getUpcomingOfficialHolidayInWeek(
  inputDate: Date
): OfficialHoliday | null {
  const date = toLocalDateOnly(inputDate);
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const years = [weekStart.getFullYear(), date.getFullYear(), weekEnd.getFullYear()];
  const holidays = Array.from(new Set(years))
    .flatMap((year) => getOfficialHolidays(year))
    .filter((holiday) => holiday.date > date && holiday.date <= weekEnd);

  return holidays.length > 0 ? holidays[0] : null;
}


export function getDayStatus(
  inputDate: Date,
  contentPack: ContentPack = getActiveContentPack()
): DayStatus {
  const date = toLocalDateOnly(inputDate);
  const matchingCelebration = getCelebrationDefinitions(contentPack).find((definition) =>
    isMatchingCelebrationDate(definition, date)
  );

  if (matchingCelebration) {
    return {
      dateLabel: formatDate(date),
      dayType: matchingCelebration.dayType,
    };
  }

  return {
    dateLabel: formatDate(date),
    dayType: 'ordinary',
  };
}
