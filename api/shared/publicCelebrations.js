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

function getLocalizedNoCelebrationText(locale) {
  if (locale === 'en') {
    return 'No celebration found for that date.';
  }

  if (locale === 'pt-BR') {
    return 'Nenhuma celebração encontrada para essa data.';
  }

  return 'Ingen firardag hittades för det datumet.';
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
    return getLocalizedNoCelebrationText(locale);
  }

  const lines = [];
  const localized = localizeEntry(entry, locale, datasetId);
  const primary = localized.celebrations[0];
  const heading =
    locale === 'en'
      ? `${localized.date} is giving ${primary.copy.title}.`
      : locale === 'pt-BR'
        ? `${localized.date} está claramente com energia de ${primary.copy.title}.`
        : `${localized.date} bär tydlig ${primary.copy.title}-energi.`;

  lines.push(heading);

  if (primary.copy.subtitle) {
    lines.push(primary.copy.subtitle);
  } else if (primary.copy.kicker) {
    lines.push(primary.copy.kicker);
  }

  if (localized.celebrations.length > 1) {
    const moreLabel =
      locale === 'en'
        ? 'Also in orbit'
        : locale === 'pt-BR'
          ? 'Também rondando'
          : 'Också i omlopp';
    lines.push(
      `${moreLabel}: ${localized.celebrations
        .slice(1, 3)
        .map((celebration) => celebration.copy.title)
        .join(', ')}`
    );
  }

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

function buildCelebrationLinks(entry) {
  const primary = entry && Array.isArray(entry.celebrations) ? entry.celebrations[0] : null;

  return {
    appUrl: `https://vadkanmanfira.se/?date=${entry.date}`,
    shareUrl: primary && primary.shareSlug ? `https://vadkanmanfira.se/share/${primary.shareSlug}/` : null,
    shareCardUrl:
      primary && primary.shareCardPath ? `https://vadkanmanfira.se${primary.shareCardPath}` : null,
  };
}

module.exports = {
  loadPublicCelebrationsDataset,
  getCelebrationDateEntry,
  getTodayCelebrationEntry,
  getUpcomingCelebrationEntries,
  localizeEntry,
  buildChatText,
  buildCelebrationLinks,
  normalizeDatasetId,
  normalizeLocale,
};
