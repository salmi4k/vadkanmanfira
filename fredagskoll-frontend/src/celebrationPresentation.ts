import { DayType } from './dayLogic';

export function formatTitle(title: string): string {
  return title.replaceAll('. ', '.\n');
}

export function hasLongTitleWord(title: string): boolean {
  return title
    .split(/\s+/)
    .some((word) => word.replace(/[^\p{L}\p{N}-]/gu, '').length >= 18);
}

export function usesCompactPrimaryMedia(dayType: DayType): boolean {
  return (
    dayType === 'kottonsdag' ||
    dayType === 'fisktorsdag' ||
    dayType === 'marmeladfredag'
  );
}
