export type DayType =
  | 'ordinary'
  | 'allahjartansdag'
  | 'fettisdag'
  | 'vaffeldagen'
  | 'valborg'
  | 'nationaldagen'
  | 'midsommarafton'
  | 'kanelbullensdag'
  | 'kladdkakansdag'
  | 'surstrommingspremiar'
  | 'lucia'
  | 'kottonsdag'
  | 'fisktorsdag'
  | 'marmeladfredag';

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

function isSameLocalDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isFixedDate(date: Date, monthIndex: number, dayOfMonth: number): boolean {
  return date.getMonth() === monthIndex && date.getDate() === dayOfMonth;
}

function isMidsommarafton(date: Date): boolean {
  return (
    date.getMonth() === 5 &&
    date.getDay() === 5 &&
    date.getDate() >= 19 &&
    date.getDate() <= 25
  );
}

function getSurstrommingspremiar(year: number): Date {
  const augustFirst = new Date(year, 7, 1);
  const firstThursdayOffset = (4 - augustFirst.getDay() + 7) % 7;
  const firstThursday = 1 + firstThursdayOffset;

  return new Date(year, 7, firstThursday + 14);
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

function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

export function getFettisdag(year: number): Date {
  return subtractDays(getEasterSunday(year), 47);
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

export function getDayStatus(inputDate: Date): DayStatus {
  const date = toLocalDateOnly(inputDate);
  const dayOfWeek = date.getDay();
  const fettisdag = getFettisdag(date.getFullYear());

  if (isFixedDate(date, 1, 14)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'allahjartansdag',
    };
  }

  if (isSameLocalDate(date, fettisdag)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'fettisdag',
    };
  }

  if (isFixedDate(date, 2, 25)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'vaffeldagen',
    };
  }

  if (isFixedDate(date, 3, 30)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'valborg',
    };
  }

  if (isFixedDate(date, 5, 6)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'nationaldagen',
    };
  }

  if (isMidsommarafton(date)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'midsommarafton',
    };
  }

  if (isFixedDate(date, 9, 4)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'kanelbullensdag',
    };
  }

  if (isFixedDate(date, 10, 7)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'kladdkakansdag',
    };
  }

  if (isSameLocalDate(date, getSurstrommingspremiar(date.getFullYear()))) {
    return {
      dateLabel: formatDate(date),
      dayType: 'surstrommingspremiar',
    };
  }

  if (isFixedDate(date, 11, 13)) {
    return {
      dateLabel: formatDate(date),
      dayType: 'lucia',
    };
  }

  if (dayOfWeek === 3) {
    return {
      dateLabel: formatDate(date),
      dayType: 'kottonsdag',
    };
  }

  if (dayOfWeek === 4) {
    return {
      dateLabel: formatDate(date),
      dayType: 'fisktorsdag',
    };
  }

  if (dayOfWeek === 5) {
    return {
      dateLabel: formatDate(date),
      dayType: 'marmeladfredag',
    };
  }

  return {
    dateLabel: formatDate(date),
    dayType: 'ordinary',
  };
}
