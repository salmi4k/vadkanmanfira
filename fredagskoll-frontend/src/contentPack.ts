export type ContentPack = 'public' | 'team';

export type TeamWeekdayDayType = 'kottonsdag' | 'fisktorsdag' | 'marmeladfredag';

type RecurringWeekdayRule = {
  dayOfWeek: number;
  dayType: TeamWeekdayDayType;
};

export const CONTENT_PACK_ENV_KEY = 'VITE_CONTENT_PACK';

export const TEAM_WEEKDAY_DAY_TYPES: TeamWeekdayDayType[] = [
  'kottonsdag',
  'fisktorsdag',
  'marmeladfredag',
];

const recurringWeekdayRulesByPack: Record<ContentPack, RecurringWeekdayRule[]> = {
  public: [],
  team: [
    { dayOfWeek: 3, dayType: 'kottonsdag' },
    { dayOfWeek: 4, dayType: 'fisktorsdag' },
    { dayOfWeek: 5, dayType: 'marmeladfredag' },
  ],
};

export function normalizeContentPack(value?: string | null): ContentPack {
  return value === 'team' ? 'team' : 'public';
}

export function getActiveContentPack(): ContentPack {
  return normalizeContentPack(import.meta.env[CONTENT_PACK_ENV_KEY]);
}

export function getRecurringWeekdayRule(
  dayOfWeek: number,
  contentPack: ContentPack
): RecurringWeekdayRule | null {
  return (
    recurringWeekdayRulesByPack[contentPack].find((rule) => rule.dayOfWeek === dayOfWeek) ?? null
  );
}

export function getRecurringWeekdayTypes(contentPack: ContentPack): TeamWeekdayDayType[] {
  return recurringWeekdayRulesByPack[contentPack].map((rule) => rule.dayType);
}

export function isTeamWeekdayDayType(dayType: string): dayType is TeamWeekdayDayType {
  return TEAM_WEEKDAY_DAY_TYPES.includes(dayType as TeamWeekdayDayType);
}

export function showsTeamBranding(contentPack: ContentPack): boolean {
  return contentPack === 'team';
}
