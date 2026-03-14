import { Locale, translateThemeDayName } from './locale';
import { buildThemeDayDynamicBlurbs } from './themeDayDynamicBlurbs';
import { getThemeDayCategoryBlurbs } from './themeDayCategoryBlurbs';
import { getThemeDaySpecificBlurbs } from './themeDaySpecificBlurbs';
import { normalizeLabel } from './themeDayTextUtils';

export { joinWithAnd } from './themeDayTextUtils';

export function buildThemeDayBlurbs(themeDays: string[], locale: Locale = 'sv'): string[] {
  const leadDay = themeDays[0];
  const displayThemeDays = themeDays.map((themeDay) => translateThemeDayName(themeDay, locale));
  const specific = locale === 'sv' ? getThemeDaySpecificBlurbs(leadDay) : null;
  const leadDayBlurbs =
    specific ?? getThemeDayCategoryBlurbs(leadDay, locale, displayThemeDays[0]);
  const dynamicBlurbs = buildThemeDayDynamicBlurbs(themeDays, locale, displayThemeDays);

  return [
    ...leadDayBlurbs,
    ...dynamicBlurbs,
  ];
}

export function filterThemeDays(themeDays: string[], blockedNames: string[]): string[] {
  const blocked = new Set(blockedNames.map((name) => normalizeLabel(name)));
  return themeDays.filter((themeDay) => !blocked.has(normalizeLabel(themeDay)));
}
