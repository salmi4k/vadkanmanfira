import themeDayTranslationsEn from './data/themeDayTranslations.en.json';

export type Locale = 'sv' | 'en';

export const LOCALE_STORAGE_KEY = 'vadkanmanfira.locale';

const officialHolidayTranslations: Record<string, string> = {
  Nyårsdagen: "New Year's Day",
  'Trettondedag jul': 'Epiphany',
  Långfredagen: 'Good Friday',
  Påskdagen: 'Easter Sunday',
  'Annandag påsk': 'Easter Monday',
  'Första maj': 'May Day',
  'Kristi himmelsfärdsdag': 'Ascension Day',
  Pingstdagen: 'Whit Sunday',
  Nationaldagen: 'National Day',
  Midsommardagen: "Midsummer's Day",
  'Alla helgons dag': "All Saints' Day",
  Juldagen: 'Christmas Day',
  'Annandag jul': 'Boxing Day',
};

const themeDayTranslationMap = themeDayTranslationsEn as Record<string, string>;

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'sv';
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'en' ? 'en' : 'sv';
}

export function getIntlLocale(locale: Locale): string {
  return locale === 'en' ? 'en-GB' : 'sv-SE';
}

export function translateOfficialHolidayName(name: string, locale: Locale): string {
  if (locale === 'sv') {
    return name;
  }

  return officialHolidayTranslations[name] ?? name;
}

export function translateThemeDayName(name: string, locale: Locale): string {
  if (locale === 'sv') {
    return name;
  }

  return themeDayTranslationMap[name] ?? name;
}

export function joinWithConjunction(items: string[], locale: Locale): string {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    return locale === 'en' ? `${items[0]} and ${items[1]}` : `${items[0]} och ${items[1]}`;
  }

  const conjunction = locale === 'en' ? 'and' : 'och';
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}
