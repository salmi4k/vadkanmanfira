import { ContentPack } from '../../contentPack';
import { formatForInput, formatForHumans } from '../../dateUtils';
import { Locale } from '../../locale';
import {
  CelebrationDayType,
  getCelebrationDefinition,
  isMatchingCelebrationDate,
} from '../celebrations/celebrationDefinitions';
import { CelebrationContent } from '../celebrations/celebrations';
import { ShareCatalogEntry, getDayTypeFromShareSlug, getShareCatalogEntry } from './shareCatalog';

const DEFAULT_SITE_ORIGIN = 'http://localhost:3000';

export type ShareableCelebration = {
  dayType: CelebrationDayType;
  entry: ShareCatalogEntry;
  shareUrl: string;
  shareCardUrl: string;
  shareTitle: string;
  shareText: string;
};

function getConfiguredSiteOrigin(): string {
  const configuredOrigin = import.meta.env.VITE_SITE_ORIGIN;
  if (typeof configuredOrigin === 'string' && configuredOrigin.trim().length > 0) {
    return configuredOrigin.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_ORIGIN;
}

export function getShareUrl(dayType: CelebrationDayType, siteOrigin = getConfiguredSiteOrigin()) {
  return `${siteOrigin}/share/${getShareCatalogEntry(dayType).slug}/`;
}

export function getShareCardUrl(
  dayType: CelebrationDayType,
  siteOrigin = getConfiguredSiteOrigin()
) {
  return `${siteOrigin}/share/cards/${getShareCatalogEntry(dayType).slug}.svg`;
}

export function findUpcomingCelebrationDate(
  dayType: CelebrationDayType,
  anchorDate: Date,
  maxDaysForward = 730
): Date | null {
  const definition = getCelebrationDefinition(dayType);
  if (!definition) {
    return null;
  }

  for (let offset = 0; offset <= maxDaysForward; offset += 1) {
    const current = new Date(anchorDate);
    current.setDate(anchorDate.getDate() + offset);
    if (isMatchingCelebrationDate(definition, current)) {
      return current;
    }
  }

  return null;
}

export function resolveInitialDateFromUrl(
  search: string,
  contentPack: ContentPack,
  anchorDate = new Date()
): Date | null {
  const params = new URLSearchParams(search);
  const explicitDate = params.get('date');
  if (explicitDate && /^\d{4}-\d{2}-\d{2}$/.test(explicitDate)) {
    return new Date(`${explicitDate}T12:00:00`);
  }

  const shareSlug = params.get('share');
  if (!shareSlug) {
    return null;
  }

  const dayType = getDayTypeFromShareSlug(shareSlug);
  if (!dayType) {
    return null;
  }

  if (contentPack === 'public' && ['kottonsdag', 'fisktorsdag', 'marmeladfredag'].includes(dayType)) {
    return null;
  }

  return findUpcomingCelebrationDate(dayType, anchorDate);
}

export function buildShareableCelebration(args: {
  celebration: CelebrationContent;
  date: Date;
  locale: Locale;
  dayType: CelebrationDayType;
  categoryLabel?: string | null;
  scoreLabel?: string | null;
}): ShareableCelebration {
  const { categoryLabel, celebration, date, dayType, locale, scoreLabel } = args;
  const humanDate = formatForHumans(date, locale);
  const shareUrl = getShareUrl(dayType);
  const shareCardUrl = getShareCardUrl(dayType);
  const shareTitle = celebration.title;
  const detailParts = [humanDate, categoryLabel, scoreLabel].filter(Boolean);
  const shareText = `${celebration.blurbs[0]}${detailParts.length > 0 ? ` ${detailParts.join(' · ')}.` : ''}`.trim();

  return {
    dayType,
    entry: getShareCatalogEntry(dayType),
    shareUrl,
    shareCardUrl,
    shareTitle,
    shareText,
  };
}

export async function copyShareLink(shareUrl: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(shareUrl);
  return true;
}

export async function shareCelebration(
  shareable: ShareableCelebration
): Promise<'shared' | 'unsupported'> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return 'unsupported';
  }

  await navigator.share({
    title: shareable.shareTitle,
    text: shareable.shareText,
    url: shareable.shareUrl,
  });

  return 'shared';
}

export function getSharePreviewQuery(date: Date, dayType: CelebrationDayType) {
  const params = new URLSearchParams({
    date: formatForInput(date),
    share: getShareCatalogEntry(dayType).slug,
  });
  return `/?${params.toString()}`;
}
