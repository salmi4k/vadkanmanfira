import { ContentPack } from '../../contentPack';
import { Locale } from '../../locale';
import { scoreEngagementSnapshot } from '../engagement/engagement';
import {
  CelebrationCategory,
  CelebrationDayType,
  getCelebrationDefinitions,
  isMatchingCelebrationDate,
} from '../celebrations/celebrationDefinitions';
import { getShareCatalogEntry } from './shareCatalog';

export type CelebrationStats = {
  totalCelebrationDays: number;
  busiestMonthLabel: string;
  busiestMonthCount: number;
  topCategoryLabel: string;
  topCategoryCount: number;
  topDates: Array<{
    dateLabel: string;
    label: string;
    score: number;
  }>;
};

function formatDateLabel(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}-${day}`;
}

function getMonthLabel(monthIndex: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, monthIndex, 1));
}

function getCategoryLabel(category: CelebrationCategory, locale: Locale): string {
  const labels: Record<Locale, Record<CelebrationCategory, string>> = {
    sv: {
      official: 'Officiell',
      food: 'Fika/fest',
      seasonal: 'Säsong',
      observance: 'Högtid',
      team: 'Intern',
    },
    en: {
      official: 'Official',
      food: 'Food',
      seasonal: 'Seasonal',
      observance: 'Observance',
      team: 'Team',
    },
    'pt-BR': {
      official: 'Oficial',
      food: 'Comida',
      seasonal: 'Sazonal',
      observance: 'Observância',
      team: 'Equipe',
    },
  };

  return labels[locale][category];
}

export function buildCelebrationStats(
  year: number,
  contentPack: ContentPack,
  locale: Locale
): CelebrationStats {
  const definitions = getCelebrationDefinitions(contentPack);
  const monthCounts = new Array(12).fill(0);
  const categoryCounts = new Map<CelebrationCategory, number>();
  const topDates: CelebrationStats['topDates'] = [];

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const current = new Date(year, monthIndex, day, 12);
      const definition = definitions.find((entry) => isMatchingCelebrationDate(entry, current));
      if (!definition) {
        continue;
      }

      monthCounts[monthIndex] += 1;
      categoryCounts.set(
        definition.category,
        (categoryCounts.get(definition.category) ?? 0) + 1
      );

      const snapshot = scoreEngagementSnapshot(current, contentPack);
      topDates.push({
        dateLabel: formatDateLabel(current),
        label: getShareCatalogEntry(definition.dayType as CelebrationDayType).label,
        score: snapshot.score,
      });
    }
  }

  const busiestMonthCount = Math.max(...monthCounts);
  const busiestMonthIndex = monthCounts.findIndex((count) => count === busiestMonthCount);
  const [topCategory = 'official', topCategoryCount = 0] =
    [...categoryCounts.entries()].sort((left, right) => right[1] - left[1])[0] ?? [];

  return {
    totalCelebrationDays: monthCounts.reduce((sum, count) => sum + count, 0),
    busiestMonthLabel: getMonthLabel(busiestMonthIndex, locale),
    busiestMonthCount,
    topCategoryLabel: getCategoryLabel(topCategory, locale),
    topCategoryCount,
    topDates: topDates.sort((left, right) => right.score - left.score).slice(0, 5),
  };
}
