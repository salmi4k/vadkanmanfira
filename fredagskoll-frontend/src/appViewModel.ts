import { appText } from './appText';
import {
  CelebrationContent,
  getCelebrationThemeAliases,
} from './features/celebrations/celebrations';
import { Locale } from './locale';
import { AiBlurbRequest } from './features/ai/aiBlurbs';
import {
  getOrdinaryThemeDayCardNotes,
  getOrdinaryThemeDayTitleEndings,
  getOrdinaryTitle,
} from './editorialText';
import { getOrdinaryDayBlurbs } from './features/celebrations/celebrations';
import { Mood } from './mood';
import { NationalDayPanel } from './features/national-days/nationalDays';
import { UpcomingNotable } from './features/upcoming/upcomingNotables';
import { SeasonalNote } from './features/upcoming/seasonalNotes';
import { ContentPack } from './contentPack';
import { DayType } from './dayLogic';

export function getCurrentCelebration(
  dayType: string,
  celebrations: Record<string, CelebrationContent>
): CelebrationContent | null {
  return dayType === 'ordinary' ? null : celebrations[dayType] ?? null;
}

export function getKicker({
  celebration,
  hasThemeDays,
  displayThemeDaysCount,
  text,
}: {
  celebration: CelebrationContent | null;
  hasThemeDays: boolean;
  displayThemeDaysCount: number;
  text: (typeof appText)[Locale];
}) {
  if (celebration) {
    return celebration.kicker;
  }

  if (hasThemeDays) {
    return displayThemeDaysCount > 1
      ? text.unofficialThemeDays(displayThemeDaysCount)
      : text.unofficialThemeDay;
  }

  return text.noOfficialEnergy;
}

type BuildMainCardViewModelArgs = {
  celebration: CelebrationContent | null;
  contentPack: ContentPack;
  dayType: DayType;
  displayThemeDays: string[];
  hasThemeDays: boolean;
  locale: Locale;
  text: (typeof appText)[Locale];
};

export function buildMainCardViewModel({
  celebration,
  contentPack,
  dayType,
  displayThemeDays,
  hasThemeDays,
  locale,
  text,
}: BuildMainCardViewModelArgs) {
  const kicker = getKicker({
    celebration,
    hasThemeDays,
    displayThemeDaysCount: displayThemeDays.length,
    text,
  });
  const themeDayDisplayTitle = hasThemeDays ? displayThemeDays[0] : null;
  const extraThemeDayLead = celebration && dayType !== 'ordinary'
    ? getCelebrationThemeAliases(dayType, locale, contentPack)[0] ?? celebration.title
    : themeDayDisplayTitle;

  return {
    extraThemeDayLead,
    kicker,
    themeDayDisplayTitle,
  };
}

type BuildAiRequestArgs = {
  celebration: CelebrationContent | null;
  contentPack: ContentPack;
  dayType: string;
  dateLabel: string;
  displayThemeDays: string[];
  extraDisplayThemeDays: string[];
  fallbackKicker: string;
  hasThemeDays: boolean;
  isWeekend: boolean;
  locale: Locale;
  mood: Mood;
  nationalDayPanel: NationalDayPanel | null;
  selectedDate: string;
  seasonalNotes: SeasonalNote[];
  themeDayBlurbs: string[] | null;
  themeDayDisplayTitle: string | null;
  upcomingHolidayName: string | null;
  upcomingNotables: UpcomingNotable[];
};

export function buildAiRequest({
  celebration,
  contentPack,
  dayType,
  dateLabel,
  displayThemeDays,
  extraDisplayThemeDays,
  fallbackKicker,
  hasThemeDays,
  isWeekend,
  locale,
  mood,
  nationalDayPanel,
  selectedDate,
  seasonalNotes,
  themeDayBlurbs,
  themeDayDisplayTitle,
  upcomingHolidayName,
  upcomingNotables,
}: BuildAiRequestArgs): AiBlurbRequest {
  const fallbackTitleEnding = getOrdinaryThemeDayTitleEndings(locale, mood)[0];
  const fallbackCardNote = getOrdinaryThemeDayCardNotes(locale, mood)[0];
  const fallbackBlurbs = celebration
    ? celebration.blurbs
    : themeDayBlurbs
    ? themeDayBlurbs
      : dayType === 'ordinary'
        ? getOrdinaryDayBlurbs(locale, isWeekend, mood)
        : [];
  const seasonalContext = seasonalNotes.map(
    (item) => `${item.label}: ${item.title}. ${item.note}`
  );
  const upcomingContext = upcomingNotables.map((item) => {
    const timing = item.daysUntil === 1 ? 'Tomorrow' : `In ${item.daysUntil} days`;
    return `${timing}: ${item.title}. ${item.note}`;
  });

  return {
    locale,
    contentPack,
    kind: celebration ? 'celebration' : hasThemeDays ? 'themeDay' : 'ordinary',
    mood,
    requestMode: 'default',
    date: selectedDate,
    dateLabel,
    dayType,
    title: celebration ? celebration.title : themeDayDisplayTitle ?? getOrdinaryTitle(locale, mood),
    subtitle: celebration?.subtitle,
    kicker: fallbackKicker,
    fallbackTitleEnding,
    fallbackCardNote,
    fallbackBlurbs,
    themeDays: displayThemeDays,
    extraThemeDays: extraDisplayThemeDays,
    seasonalTitles: seasonalContext,
    upcomingTitles: upcomingContext,
    upcomingHolidayName: upcomingHolidayName ?? undefined,
    nationalDaySummary: nationalDayPanel?.summary,
    allowHumor: true,
  };
}
