import { Locale } from './locale';

export function joinWithAnd(items: string[], locale: Locale = 'sv'): string {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  const conjunction = locale === 'en' ? 'and' : 'och';

  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}

export function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}
