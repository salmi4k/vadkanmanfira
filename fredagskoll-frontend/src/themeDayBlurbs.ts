import { getThemeDayCategoryBlurbs } from './themeDayCategoryBlurbs';
import { getThemeDaySpecificBlurbs } from './themeDaySpecificBlurbs';
import { joinWithAnd, normalizeLabel } from './themeDayTextUtils';

export { joinWithAnd } from './themeDayTextUtils';

export function buildThemeDayBlurbs(themeDays: string[]): string[] {
  const leadDay = themeDays[0];
  const allDays = joinWithAnd(themeDays);
  const specific = getThemeDaySpecificBlurbs(leadDay);
  const leadDayBlurbs = specific ?? getThemeDayCategoryBlurbs(leadDay);

  return [
    ...leadDayBlurbs,
    `${allDays} står på schemat för datumet. Det är inte officiellt, men det är fullt tillräckligt.`,
    `Det här datumet är inte tomt. Det tillhör ${leadDay}, och det vore småaktigt att ignorera det.`,
    `Om någon undrar varför stämningen känns orimligt specifik så är svaret ${allDays}.`,
  ];
}

export function filterThemeDays(themeDays: string[], blockedNames: string[]): string[] {
  const blocked = new Set(blockedNames.map((name) => normalizeLabel(name)));
  return themeDays.filter((themeDay) => !blocked.has(normalizeLabel(themeDay)));
}
