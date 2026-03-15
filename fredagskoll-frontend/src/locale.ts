import themeDayTranslationsEn from './data/themeDayTranslations.en.json';
import themeDayTranslationsPtBr from './data/themeDayTranslations.pt-BR.json';
import { readStoredPreferences, writeStoredPreferences } from './preferences';

export type Locale = 'sv' | 'en' | 'pt-BR';

export const LOCALE_STORAGE_KEY = 'vadkanmanfira.locale';

export const localeOptions: Array<{
  value: Locale;
  flag: string;
  label: string;
  shortLabel: string;
}> = [
  { value: 'sv', flag: '🇸🇪', label: 'Svenska', shortLabel: 'SV' },
  { value: 'en', flag: '🇬🇧', label: 'English', shortLabel: 'EN' },
  { value: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)', shortLabel: 'PT' },
];

const officialHolidayTranslations: Record<Locale, Record<string, string>> = {
  sv: {},
  en: {
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
  },
  'pt-BR': {
    Nyårsdagen: 'Ano-Novo',
    'Trettondedag jul': 'Epifania',
    Långfredagen: 'Sexta-feira Santa',
    Påskdagen: 'Domingo de Páscoa',
    'Annandag påsk': 'Segunda-feira de Páscoa',
    'Första maj': 'Dia do Trabalho',
    'Kristi himmelsfärdsdag': 'Ascensão de Cristo',
    Pingstdagen: 'Pentecostes',
    Nationaldagen: 'Dia Nacional',
    Midsommardagen: 'Dia do Solstício de Verão',
    'Alla helgons dag': 'Dia de Todos os Santos',
    Juldagen: 'Dia de Natal',
    'Annandag jul': 'Segundo Dia de Natal',
  },
};

const themeDayTranslationMapByLocale: Record<Locale, Record<string, string>> = {
  sv: {},
  en: themeDayTranslationsEn as Record<string, string>,
  'pt-BR': themeDayTranslationsPtBr as Record<string, string>,
};

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'sv';
  }

  const storedPreferences = readStoredPreferences();
  if (
    storedPreferences?.locale === 'en' ||
    storedPreferences?.locale === 'pt-BR' ||
    storedPreferences?.locale === 'sv'
  ) {
    return storedPreferences.locale;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'en' || stored === 'pt-BR' ? stored : 'sv';
}

export function persistLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }

  writeStoredPreferences({ locale });
}

export function getIntlLocale(locale: Locale): string {
  switch (locale) {
    case 'en':
      return 'en-GB';
    case 'pt-BR':
      return 'pt-BR';
    default:
      return 'sv-SE';
  }
}

export function translateOfficialHolidayName(name: string, locale: Locale): string {
  if (locale === 'sv') {
    return name;
  }

  return officialHolidayTranslations[locale][name] ?? name;
}

export function translateThemeDayName(name: string, locale: Locale): string {
  if (locale === 'sv') {
    return name;
  }

  return themeDayTranslationMapByLocale[locale][name] ?? name;
}

export function joinWithConjunction(items: string[], locale: Locale): string {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    if (locale === 'en') {
      return `${items[0]} and ${items[1]}`;
    }

    if (locale === 'pt-BR') {
      return `${items[0]} e ${items[1]}`;
    }

    return `${items[0]} och ${items[1]}`;
  }

  const conjunction = locale === 'en' ? 'and' : locale === 'pt-BR' ? 'e' : 'och';
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}
