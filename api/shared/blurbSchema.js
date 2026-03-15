const SUPPORTED_LOCALES = new Set(['sv', 'en', 'pt-BR']);
const SUPPORTED_PACKS = new Set(['public', 'team']);
const SUPPORTED_KINDS = new Set(['celebration', 'themeDay', 'ordinary']);
const SUPPORTED_MOODS = new Set(['dry', 'cheerful', 'chaotic', 'formal', 'absurd', 'warm']);
const SUPPORTED_REQUEST_MODES = new Set(['default', 'reroll']);

function coerceString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function coerceStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function coerceBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeRequestBody(body) {
  const source = body && typeof body === 'object' ? body : {};
  const locale = SUPPORTED_LOCALES.has(source.locale) ? source.locale : 'sv';
  const contentPack = SUPPORTED_PACKS.has(source.contentPack) ? source.contentPack : 'public';
  const kind = SUPPORTED_KINDS.has(source.kind) ? source.kind : 'ordinary';
  const mood = SUPPORTED_MOODS.has(source.mood) ? source.mood : 'dry';
  const requestMode = SUPPORTED_REQUEST_MODES.has(source.requestMode)
    ? source.requestMode
    : 'default';

  return {
    locale,
    contentPack,
    kind,
    mood,
    requestMode,
    date: coerceString(source.date),
    dateLabel: coerceString(source.dateLabel),
    dayType: coerceString(source.dayType, 'ordinary'),
    title: coerceString(source.title),
    subtitle: coerceString(source.subtitle),
    kicker: coerceString(source.kicker),
    fallbackTitleEnding: coerceString(source.fallbackTitleEnding),
    fallbackCardNote: coerceString(source.fallbackCardNote),
    fallbackBlurbs: coerceStringArray(source.fallbackBlurbs),
    themeDays: coerceStringArray(source.themeDays),
    extraThemeDays: coerceStringArray(source.extraThemeDays),
    seasonalTitles: coerceStringArray(source.seasonalTitles),
    upcomingTitles: coerceStringArray(source.upcomingTitles),
    upcomingHolidayName: coerceString(source.upcomingHolidayName),
    nationalDaySummary: coerceString(source.nationalDaySummary),
    allowHumor: coerceBoolean(source.allowHumor, true),
  };
}

function isValidRequest(request) {
  return (
    request.date.length > 0 &&
    request.title.length > 0 &&
    request.fallbackBlurbs.length > 0
  );
}

module.exports = {
  normalizeRequestBody,
  isValidRequest,
};
