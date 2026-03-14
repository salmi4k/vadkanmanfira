import { getIntlLocale, Locale } from './locale';

export function formatForInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatForHumans(date: Date, locale: Locale = 'sv'): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortSwedishDate(date: Date, locale: Locale = 'sv'): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getSwedishOrdinalDay(day: number): string {
  const tens = day % 100;
  const ones = day % 10;

  if (tens !== 11 && (ones === 1 || ones === 2)) {
    return `${day}:a`;
  }

  return `${day}:e`;
}

function getEnglishOrdinalDay(day: number): string {
  const mod10 = day % 10;
  const mod100 = day % 100;

  if (mod10 === 1 && mod100 !== 11) return `${day}st`;
  if (mod10 === 2 && mod100 !== 12) return `${day}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${day}rd`;
  return `${day}th`;
}

export function formatCenterDate(date: Date, locale: Locale = 'sv'): string {
  const intlLocale = getIntlLocale(locale);
  const weekday = new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
  }).format(date);
  const month = new Intl.DateTimeFormat(intlLocale, {
    month: 'long',
  }).format(date);
  if (locale === 'sv') {
    return `${weekday} ${getSwedishOrdinalDay(date.getDate())} ${month}`;
  }

  if (locale === 'pt-BR') {
    return `${weekday}, ${date.getDate()} de ${month}`;
  }

  return `${weekday}, ${month} ${getEnglishOrdinalDay(date.getDate())}`;
}

export function getDaysUntil(date: Date, target: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - date.getTime()) / millisecondsPerDay);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
