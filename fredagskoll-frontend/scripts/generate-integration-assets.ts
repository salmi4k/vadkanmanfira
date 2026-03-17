import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import celebrationsEn from '../src/data/celebrations.en.json';
import celebrationsPtBr from '../src/data/celebrations.pt-BR.json';
import { formatForInput } from '../src/dateUtils';
import {
  CelebrationCategory,
  CelebrationDayType,
  getCelebrationDateForYear,
  getCelebrationDefinitions,
} from '../src/features/celebrations/celebrationDefinitions';
import {
  ExpansionDatasetId,
  getInternationalCelebrationDate,
  getInternationalCelebrationDatasets,
} from '../src/features/expansion/internationalCelebrations';
import {
  getCategoryLabel,
  getEngagementScoreLabel,
  scoreEngagementSnapshot,
} from '../src/features/engagement/engagement';
import { getThemeDaysForDate } from '../src/features/theme-days/temadagar';
import { getOfficialHolidays } from '../src/dayLogic';
import { Locale } from '../src/locale';
import { getShareCatalogEntry } from '../src/features/shareability/shareCatalog';

type LocalizedCelebrationCopy = {
  title: string;
  subtitle: string;
  kicker: string;
  visualBadge?: string;
};

type ApiCelebrationItem = {
  dayType: string;
  category: string;
  categoryLabels: Record<Locale, string | null>;
  score: number;
  scoreLabels: Record<Locale, string>;
  shareSlug: string | null;
  shareCardPath: string | null;
  copy: Record<Locale, LocalizedCelebrationCopy>;
  aliases: Record<Locale, string[]>;
};

type ApiCelebrationDateEntry = {
  date: string;
  themeDays: string[];
  officialHolidayName: string | null;
  celebrations: ApiCelebrationItem[];
};

type ApiCelebrationDataset = {
  id: ExpansionDatasetId;
  label: string;
  defaultLocale: Locale;
  generatedAt: string;
  firstDate: string;
  lastDate: string;
  totalCelebrationDates: number;
  byDate: Record<string, ApiCelebrationDateEntry>;
};

type ApiCelebrationDatasetBundle = {
  generatedAt: string;
  datasets: Record<ExpansionDatasetId, ApiCelebrationDataset>;
};

type LocalizedCelebrationPayload = {
  celebrations: Partial<
    Record<
      CelebrationDayType,
      {
        title?: string;
        subtitle?: string;
        kicker?: string;
        visualBadge?: string;
      }
    >
  >;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(frontendRoot, '..');
const apiGeneratedDir = path.join(repoRoot, 'api', 'shared', 'generated');
const publicExportsDir = path.join(frontendRoot, 'public', 'exports');
const englishCelebrationContent = celebrationsEn as LocalizedCelebrationPayload;
const portugueseCelebrationContent = celebrationsPtBr as LocalizedCelebrationPayload;

function sortByDateLabel<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.date.localeCompare(right.date));
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function buildIcsDate(dateLabel: string): string {
  return dateLabel.replace(/-/g, '');
}

function getCategoryLabels(category: CelebrationCategory): Record<Locale, string | null> {
  return {
    sv: getCategoryLabel(category, 'sv'),
    en: getCategoryLabel(category, 'en'),
    'pt-BR': getCategoryLabel(category, 'pt-BR'),
  };
}

function getScoreLabels(score: number): Record<Locale, string> {
  return {
    sv: getEngagementScoreLabel(score, 'sv'),
    en: getEngagementScoreLabel(score, 'en'),
    'pt-BR': getEngagementScoreLabel(score, 'pt-BR'),
  };
}

function buildSwedishLocalizedCopy(
  dayType: CelebrationDayType,
  locale: Locale
): LocalizedCelebrationCopy {
  const shareEntry = getShareCatalogEntry(dayType);
  const localizedSource =
    locale === 'en'
      ? englishCelebrationContent.celebrations[dayType]
      : locale === 'pt-BR'
        ? portugueseCelebrationContent.celebrations[dayType]
        : null;

  return {
    title: localizedSource?.title ?? shareEntry.label,
    subtitle: localizedSource?.subtitle ?? '',
    kicker: localizedSource?.kicker ?? shareEntry.badge,
    visualBadge: localizedSource?.visualBadge ?? shareEntry.badge,
  };
}

function buildSwedishDataset(startYear: number, endYear: number): ApiCelebrationDataset {
  const byDate = new Map<string, ApiCelebrationDateEntry>();
  const definitions = getCelebrationDefinitions('public');

  for (let year = startYear; year <= endYear; year += 1) {
    const officialHolidays = getOfficialHolidays(year);

    for (const definition of definitions) {
      const date = getCelebrationDateForYear(definition, year);
      if (!date) {
        continue;
      }

      const dateLabel = formatForInput(date);
      const snapshot = scoreEngagementSnapshot(date, 'public');
      const shareEntry = getShareCatalogEntry(definition.dayType);
      const existing = byDate.get(dateLabel) ?? {
        date: dateLabel,
        themeDays: getThemeDaysForDate(date),
        officialHolidayName:
          officialHolidays.find((holiday) => holiday.dateLabel === dateLabel)?.name ?? null,
        celebrations: [],
      };

      existing.celebrations.push({
        dayType: definition.dayType,
        category: definition.category,
        categoryLabels: getCategoryLabels(definition.category),
        score: snapshot.score,
        scoreLabels: getScoreLabels(snapshot.score),
        shareSlug: shareEntry.slug,
        shareCardPath: `/share/cards/${shareEntry.slug}.svg`,
        copy: {
          sv: buildSwedishLocalizedCopy(definition.dayType, 'sv'),
          en: buildSwedishLocalizedCopy(definition.dayType, 'en'),
          'pt-BR': buildSwedishLocalizedCopy(definition.dayType, 'pt-BR'),
        },
        aliases: {
          sv: [],
          en: [],
          'pt-BR': [],
        },
      });
      existing.celebrations.sort((left, right) => right.score - left.score);
      byDate.set(dateLabel, existing);
    }
  }

  const orderedEntries = sortByDateLabel(Array.from(byDate.values()));
  return {
    id: 'sv-SE',
    label: 'Sweden',
    defaultLocale: 'sv',
    generatedAt: new Date().toISOString(),
    firstDate: orderedEntries[0]?.date ?? '',
    lastDate: orderedEntries[orderedEntries.length - 1]?.date ?? '',
    totalCelebrationDates: orderedEntries.length,
    byDate: Object.fromEntries(orderedEntries.map((entry) => [entry.date, entry])),
  };
}

function buildInternationalDatasets(startYear: number, endYear: number): ApiCelebrationDataset[] {
  return getInternationalCelebrationDatasets().map((dataset) => {
    const byDate = new Map<string, ApiCelebrationDateEntry>();

    for (let year = startYear; year <= endYear; year += 1) {
      for (const rule of dataset.rules) {
        const date = getInternationalCelebrationDate(year, rule.rule);
        const dateLabel = formatForInput(date);
        const existing = byDate.get(dateLabel) ?? {
          date: dateLabel,
          themeDays: [],
          officialHolidayName: null,
          celebrations: [],
        };

        existing.celebrations.push({
          dayType: rule.dayType,
          category: rule.category,
          categoryLabels: getCategoryLabels(rule.category),
          score: rule.score,
          scoreLabels: getScoreLabels(rule.score),
          shareSlug: null,
          shareCardPath: null,
          copy: rule.copy,
          aliases: {
            sv: [],
            en: [],
            'pt-BR': [],
          },
        });
        byDate.set(dateLabel, existing);
      }
    }

    const orderedEntries = sortByDateLabel(Array.from(byDate.values()));
    return {
      id: dataset.id,
      label: dataset.label,
      defaultLocale: dataset.defaultLocale,
      generatedAt: new Date().toISOString(),
      firstDate: orderedEntries[0]?.date ?? '',
      lastDate: orderedEntries[orderedEntries.length - 1]?.date ?? '',
      totalCelebrationDates: orderedEntries.length,
      byDate: Object.fromEntries(orderedEntries.map((entry) => [entry.date, entry])),
    };
  });
}

function buildCalendar(dataset: ApiCelebrationDataset): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Vad kan man fira//Celebration Calendar//${dataset.id}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(dataset.label)} celebrations`,
    `X-WR-CALDESC:${escapeIcsText(`Celebration calendar generated by Vad kan man fira? for ${dataset.label}.`)}`,
  ];

  for (const entry of Object.values(dataset.byDate)) {
    const primary = entry.celebrations[0];
    if (!primary) {
      continue;
    }

    const dtStart = buildIcsDate(entry.date);
    const endDate = new Date(`${entry.date}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);
    const dtEnd = buildIcsDate(formatForInput(endDate));
    const summary = escapeIcsText(primary.copy[dataset.defaultLocale].title);
    const description = escapeIcsText(
      [
        primary.copy[dataset.defaultLocale].subtitle,
        primary.copy[dataset.defaultLocale].kicker,
        entry.themeDays.length > 0 ? `Theme days: ${entry.themeDays.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' ')
    );

    lines.push(
      'BEGIN:VEVENT',
      `UID:${entry.date}-${primary.dayType}@vadkanmanfira.se`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `URL:https://vadkanmanfira.se/?date=${entry.date}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

async function main() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const endYear = currentYear + 5;
  const swedishDataset = buildSwedishDataset(startYear, endYear);
  const internationalDatasets = buildInternationalDatasets(startYear, endYear);
  const bundle: ApiCelebrationDatasetBundle = {
    generatedAt: new Date().toISOString(),
    datasets: {
      'sv-SE': swedishDataset,
      'en-US': internationalDatasets.find((dataset) => dataset.id === 'en-US'),
    } as Record<ExpansionDatasetId, ApiCelebrationDataset>,
  };

  await mkdir(apiGeneratedDir, { recursive: true });
  await mkdir(publicExportsDir, { recursive: true });

  await writeFile(
    path.join(apiGeneratedDir, 'public-celebrations.json'),
    `${JSON.stringify(bundle, null, 2)}\n`,
    'utf8'
  );

  await writeFile(
    path.join(publicExportsDir, 'vadkanmanfira-public.ics'),
    buildCalendar(swedishDataset),
    'utf8'
  );
  await writeFile(
    path.join(publicExportsDir, 'vadkanmanfira-sv-SE.ics'),
    buildCalendar(swedishDataset),
    'utf8'
  );

  for (const dataset of internationalDatasets) {
    await writeFile(
      path.join(publicExportsDir, `vadkanmanfira-${dataset.id}.ics`),
      buildCalendar(dataset),
      'utf8'
    );
  }

  console.log(
    `Generated integration datasets for ${Object.keys(bundle.datasets).join(', ')} (${startYear}-${endYear})`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
