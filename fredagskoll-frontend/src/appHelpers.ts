import { buildInfo } from './buildInfo.generated';
import { getCelebrationThemeAliases } from './features/celebrations/celebrations';
import { ContentPack } from './contentPack';
import { DayType } from './dayLogic';
import { getIntlLocale, Locale } from './locale';

const imageCreditDayTypes: Record<string, Exclude<DayType, 'ordinary'> | undefined> = {
  vaffeldagen: 'vaffeldagen',
  valborg: 'valborg',
  paskafton: 'paskafton',
  nationaldagen: 'nationaldagen',
  midsommarafton: 'midsommarafton',
  kanelbullensdag: 'kanelbullensdag',
  kladdkakansdag: 'kladdkakansdag',
  surstrommingspremiar: 'surstrommingspremiar',
  lucia: 'lucia',
  nyarsafton: 'nyarsafton',
};

export function getRandomItem(options: string[], fallback: string, current?: string): string {
  if (options.length === 0) {
    return fallback;
  }

  if (options.length === 1) {
    return options[0];
  }

  const candidates = current ? options.filter((option) => option !== current) : options;
  const pool = candidates.length > 0 ? candidates : options;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function getImageCreditLabel(
  slug: string,
  locale: Locale,
  contentPack: ContentPack
): string {
  const dayType = imageCreditDayTypes[slug];
  if (!dayType) {
    return slug;
  }

  const aliases = getCelebrationThemeAliases(dayType, locale, contentPack);
  return aliases[0] ?? slug;
}

export function getInitialMobileLayout(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 640px)').matches
    : false;
}

export function formatBuildStamp(locale: Locale): string {
  const builtAt = new Date(buildInfo.builtAt);
  const formattedTime = new Intl.DateTimeFormat(getIntlLocale(locale), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(builtAt);

  return `v${buildInfo.version} | ${buildInfo.buildRef} | ${formattedTime}`;
}
