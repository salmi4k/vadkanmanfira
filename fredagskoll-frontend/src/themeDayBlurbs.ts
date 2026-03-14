import { buildThemeDayDynamicBlurbs } from './themeDayDynamicBlurbs';
import { getThemeDayCategoryBlurbs } from './themeDayCategoryBlurbs';
import { getThemeDaySpecificBlurbs } from './themeDaySpecificBlurbs';
import { normalizeLabel } from './themeDayTextUtils';

export { joinWithAnd } from './themeDayTextUtils';

export function buildThemeDayBlurbs(themeDays: string[]): string[] {
  const leadDay = themeDays[0];
  const specific = getThemeDaySpecificBlurbs(leadDay);
  const leadDayBlurbs = specific ?? getThemeDayCategoryBlurbs(leadDay);
  const dynamicBlurbs = buildThemeDayDynamicBlurbs(themeDays);

  return [
    ...leadDayBlurbs,
    ...dynamicBlurbs,
  ];
}

export function filterThemeDays(themeDays: string[], blockedNames: string[]): string[] {
  const blocked = new Set(blockedNames.map((name) => normalizeLabel(name)));
  return themeDays.filter((themeDay) => !blocked.has(normalizeLabel(themeDay)));
}
