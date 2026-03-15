import { ContentPack, TeamWeekdayDayType } from '../../contentPack';

export type CelebrationDayType =
  | 'allahjartansdag'
  | 'fettisdag'
  | 'paskafton'
  | 'vaffeldagen'
  | 'valborg'
  | 'nationaldagen'
  | 'midsommarafton'
  | 'kanelbullensdag'
  | 'kladdkakansdag'
  | 'surstrommingspremiar'
  | 'lucia'
  | 'julafton'
  | 'nyarsafton'
  | TeamWeekdayDayType;

export type CelebrationCategory =
  | 'official'
  | 'food'
  | 'seasonal'
  | 'observance'
  | 'team';

type CelebrationRuleBase = {
  id: CelebrationDayType;
  dayType: CelebrationDayType;
  category: CelebrationCategory;
  contentPack?: ContentPack;
  priority: number;
};

type FixedDateRule = CelebrationRuleBase & {
  dateType: 'fixed';
  monthIndex: number;
  dayOfMonth: number;
};

type EasterRelativeRule = CelebrationRuleBase & {
  dateType: 'easter-relative';
  offsetDays: number;
};

type MonthWeekdayWindowRule = CelebrationRuleBase & {
  dateType: 'month-weekday-window';
  monthIndex: number;
  weekday: number;
  dayOfMonthStart: number;
  dayOfMonthEnd: number;
};

type ComputedDateRule = CelebrationRuleBase & {
  dateType: 'computed';
  getDate: (year: number) => Date;
};

type RecurringWeekdayRule = CelebrationRuleBase & {
  dateType: 'recurring-weekday';
  weekday: number;
};

export type CelebrationDefinition =
  | FixedDateRule
  | EasterRelativeRule
  | MonthWeekdayWindowRule
  | ComputedDateRule
  | RecurringWeekdayRule;

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function getSurstrommingspremiar(year: number): Date {
  const augustFirst = new Date(year, 7, 1);
  const firstThursdayOffset = (4 - augustFirst.getDay() + 7) % 7;
  const firstThursday = 1 + firstThursdayOffset;

  return new Date(year, 7, firstThursday + 14);
}

export function getEasterSunday(year: number): Date {
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

export function getFettisdagDate(year: number): Date {
  return subtractDays(getEasterSunday(year), 47);
}

export const celebrationDefinitions: CelebrationDefinition[] = [
  {
    id: 'allahjartansdag',
    dayType: 'allahjartansdag',
    dateType: 'fixed',
    monthIndex: 1,
    dayOfMonth: 14,
    category: 'observance',
    priority: 100,
  },
  {
    id: 'fettisdag',
    dayType: 'fettisdag',
    dateType: 'easter-relative',
    offsetDays: -47,
    category: 'food',
    priority: 100,
  },
  {
    id: 'paskafton',
    dayType: 'paskafton',
    dateType: 'easter-relative',
    offsetDays: -1,
    category: 'official',
    priority: 100,
  },
  {
    id: 'vaffeldagen',
    dayType: 'vaffeldagen',
    dateType: 'fixed',
    monthIndex: 2,
    dayOfMonth: 25,
    category: 'food',
    priority: 100,
  },
  {
    id: 'valborg',
    dayType: 'valborg',
    dateType: 'fixed',
    monthIndex: 3,
    dayOfMonth: 30,
    category: 'seasonal',
    priority: 100,
  },
  {
    id: 'nationaldagen',
    dayType: 'nationaldagen',
    dateType: 'fixed',
    monthIndex: 5,
    dayOfMonth: 6,
    category: 'official',
    priority: 100,
  },
  {
    id: 'midsommarafton',
    dayType: 'midsommarafton',
    dateType: 'month-weekday-window',
    monthIndex: 5,
    weekday: 5,
    dayOfMonthStart: 19,
    dayOfMonthEnd: 25,
    category: 'official',
    priority: 100,
  },
  {
    id: 'kanelbullensdag',
    dayType: 'kanelbullensdag',
    dateType: 'fixed',
    monthIndex: 9,
    dayOfMonth: 4,
    category: 'food',
    priority: 100,
  },
  {
    id: 'kladdkakansdag',
    dayType: 'kladdkakansdag',
    dateType: 'fixed',
    monthIndex: 10,
    dayOfMonth: 7,
    category: 'food',
    priority: 100,
  },
  {
    id: 'surstrommingspremiar',
    dayType: 'surstrommingspremiar',
    dateType: 'computed',
    getDate: getSurstrommingspremiar,
    category: 'food',
    priority: 100,
  },
  {
    id: 'lucia',
    dayType: 'lucia',
    dateType: 'fixed',
    monthIndex: 11,
    dayOfMonth: 13,
    category: 'observance',
    priority: 100,
  },
  {
    id: 'julafton',
    dayType: 'julafton',
    dateType: 'fixed',
    monthIndex: 11,
    dayOfMonth: 24,
    category: 'official',
    priority: 100,
  },
  {
    id: 'nyarsafton',
    dayType: 'nyarsafton',
    dateType: 'fixed',
    monthIndex: 11,
    dayOfMonth: 31,
    category: 'official',
    priority: 100,
  },
  {
    id: 'kottonsdag',
    dayType: 'kottonsdag',
    dateType: 'recurring-weekday',
    weekday: 3,
    contentPack: 'team',
    category: 'team',
    priority: 10,
  },
  {
    id: 'fisktorsdag',
    dayType: 'fisktorsdag',
    dateType: 'recurring-weekday',
    weekday: 4,
    contentPack: 'team',
    category: 'team',
    priority: 10,
  },
  {
    id: 'marmeladfredag',
    dayType: 'marmeladfredag',
    dateType: 'recurring-weekday',
    weekday: 5,
    contentPack: 'team',
    category: 'team',
    priority: 10,
  },
];

export function getCelebrationDefinitions(
  contentPack: ContentPack
): CelebrationDefinition[] {
  return celebrationDefinitions
    .filter((definition) => !definition.contentPack || definition.contentPack === contentPack)
    .sort((left, right) => right.priority - left.priority);
}

export function isMatchingCelebrationDate(
  definition: CelebrationDefinition,
  date: Date
): boolean {
  switch (definition.dateType) {
    case 'fixed':
      return (
        date.getMonth() === definition.monthIndex &&
        date.getDate() === definition.dayOfMonth
      );
    case 'easter-relative': {
      const targetDate = new Date(getEasterSunday(date.getFullYear()));
      targetDate.setDate(targetDate.getDate() + definition.offsetDays);
      return isSameLocalDate(date, targetDate);
    }
    case 'month-weekday-window':
      return (
        date.getMonth() === definition.monthIndex &&
        date.getDay() === definition.weekday &&
        date.getDate() >= definition.dayOfMonthStart &&
        date.getDate() <= definition.dayOfMonthEnd
      );
    case 'computed':
      return isSameLocalDate(date, definition.getDate(date.getFullYear()));
    case 'recurring-weekday':
      return date.getDay() === definition.weekday;
    default:
      return false;
  }
}

function isSameLocalDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function getCelebrationDefinition(
  dayType: CelebrationDayType
): CelebrationDefinition | null {
  return celebrationDefinitions.find((definition) => definition.dayType === dayType) ?? null;
}

export function getTeamWeekdayCelebrationDefinitions(): CelebrationDefinition[] {
  return celebrationDefinitions.filter(
    (definition): definition is RecurringWeekdayRule => definition.dateType === 'recurring-weekday'
  );
}

export function isTeamWeekdayCelebrationDayType(
  dayType: CelebrationDayType
): dayType is TeamWeekdayDayType {
  return getTeamWeekdayCelebrationDefinitions().some((definition) => definition.dayType === dayType);
}
