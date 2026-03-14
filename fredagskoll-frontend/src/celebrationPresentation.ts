import { DayType } from './dayLogic';

export const ordinaryThemeDayTitleEndings = [
  'Det får väl bära dagen då.',
  'Det är åtminstone något att skylla på.',
  'Kontoret får helt enkelt acceptera saken.',
  'Det är mer än kalendern brukar erbjuda.',
  'Det blir inte bättre än så här idag.',
  'Det får duga som dagens professionella ursäkt.',
  'Vi tar det och går vidare.',
  'Det är i alla fall bättre än ren tomhet.',
];

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
