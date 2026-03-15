import { Locale, translateThemeDayName } from './locale';
import { Mood } from './mood';
import { buildThemeDayDynamicBlurbs } from './themeDayDynamicBlurbs';
import { getThemeDayCategoryBlurbs } from './themeDayCategoryBlurbs';
import { getThemeDaySpecificBlurbs } from './themeDaySpecificBlurbs';
import { normalizeLabel } from './themeDayTextUtils';

export { joinWithAnd } from './themeDayTextUtils';

export function buildThemeDayBlurbs(
  themeDays: string[],
  locale: Locale = 'sv',
  mood: Mood = 'dry'
): string[] {
  const leadDay = themeDays[0];
  const displayThemeDays = themeDays.map((themeDay) => translateThemeDayName(themeDay, locale));
  const specific = getThemeDaySpecificBlurbs(leadDay, locale, mood, displayThemeDays[0]);
  const leadDayBlurbs =
    specific ?? getThemeDayCategoryBlurbs(leadDay, locale, displayThemeDays[0], mood);
  const dynamicBlurbs = buildThemeDayDynamicBlurbs(themeDays, locale, displayThemeDays, mood);

  return [
    ...leadDayBlurbs,
    ...dynamicBlurbs,
  ];
}

export function filterThemeDays(themeDays: string[], blockedNames: string[]): string[] {
  const blocked = new Set(blockedNames.map((name) => normalizeLabel(name)));
  return themeDays.filter((themeDay) => !blocked.has(normalizeLabel(themeDay)));
}
