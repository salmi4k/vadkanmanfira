const fs = require('fs');
const path = require('path');

let cachedBundle = null;

function getDatasetPath() {
  return path.join(__dirname, 'generated', 'public-celebrations.json');
}

function normalizeDatasetId(value) {
  return value === 'en-US' ? 'en-US' : 'sv-SE';
}

function loadDatasetBundle() {
  if (cachedBundle) {
    return cachedBundle;
  }

  const filePath = getDatasetPath();
  const raw = fs.readFileSync(filePath, 'utf8');
  cachedBundle = JSON.parse(raw);
  return cachedBundle;
}

function loadPublicCelebrationsDataset(datasetId = 'sv-SE') {
  const bundle = loadDatasetBundle();
  return bundle.datasets[normalizeDatasetId(datasetId)];
}

function formatDateLabel(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateLabel(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeLocale(value) {
  return value === 'en' || value === 'pt-BR' ? value : 'sv';
}

function getCelebrationDateEntry(dateLabel, datasetId = 'sv-SE') {
  if (!isValidDateLabel(dateLabel)) {
    return null;
  }

  const dataset = loadPublicCelebrationsDataset(datasetId);
  return dataset.byDate[dateLabel] || null;
}

function getTodayCelebrationEntry(now = new Date(), datasetId = 'sv-SE') {
  return getCelebrationDateEntry(formatDateLabel(now), datasetId);
}

function getUpcomingCelebrationEntries(startDateLabel, limit = 10, datasetId = 'sv-SE') {
  const dataset = loadPublicCelebrationsDataset(datasetId);
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(30, Math.floor(limit))) : 10;
  const anchor = isValidDateLabel(startDateLabel) ? startDateLabel : formatDateLabel(new Date());

  return Object.values(dataset.byDate)
    .filter((entry) => entry.date >= anchor)
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(0, safeLimit);
}

function mapCelebrationForLocale(entry, locale) {
  return {
    ...entry,
    categoryLabel: entry.categoryLabels[locale] || null,
    scoreLabel: entry.scoreLabels[locale],
    copy: entry.copy[locale],
    aliases: entry.aliases[locale],
  };
}

function localizeEntry(entry, locale = 'sv', datasetId = 'sv-SE') {
  const safeLocale = datasetId === 'en-US' && locale === 'sv' ? 'en' : normalizeLocale(locale);

  return {
    ...entry,
    celebrations: entry.celebrations.map((celebration) =>
      mapCelebrationForLocale(celebration, safeLocale)
    ),
  };
}

function buildChatText(entry, locale = 'sv', datasetId = 'sv-SE') {
  if (!entry || !entry.celebrations || entry.celebrations.length === 0) {
    if (locale === 'en') {
      return 'No celebration found for that date.';
    }

    if (locale === 'pt-BR') {
      return 'Nenhuma celebracao encontrada para essa data.';
    }

    return 'Ingen firardag hittades for det datumet.';
  }

  const lines = [];
  const localized = localizeEntry(entry, locale, datasetId);
  const heading =
    locale === 'en'
      ? `Today we celebrate ${localized.date}:`
      : locale === 'pt-BR'
        ? `Hoje celebramos ${localized.date}:`
        : `Idag firar vi ${localized.date}:`;

  lines.push(heading);

  localized.celebrations.forEach((celebration) => {
    lines.push(`- ${celebration.copy.title}`);
  });

  if (localized.themeDays.length > 0) {
    const themeDayLabel =
      locale === 'en'
        ? 'Theme days'
        : locale === 'pt-BR'
          ? 'Temas do dia'
          : 'Temadagar';
    lines.push(`${themeDayLabel}: ${localized.themeDays.slice(0, 3).join(', ')}`);
  }

  return lines.join('\n');
}

module.exports = {
  loadPublicCelebrationsDataset,
  getCelebrationDateEntry,
  getTodayCelebrationEntry,
  getUpcomingCelebrationEntries,
  localizeEntry,
  buildChatText,
  normalizeDatasetId,
  normalizeLocale,
};
