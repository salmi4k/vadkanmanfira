const SUPPORTED_LOCALES = new Set(['sv', 'en', 'pt-BR']);
const SUPPORTED_PACKS = new Set(['public', 'team']);
const SUPPORTED_KINDS = new Set(['celebration', 'themeDay', 'ordinary']);

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
  const locale = SUPPORTED_LOCALES.has(body?.locale) ? body.locale : 'sv';
  const contentPack = SUPPORTED_PACKS.has(body?.contentPack) ? body.contentPack : 'public';
  const kind = SUPPORTED_KINDS.has(body?.kind) ? body.kind : 'ordinary';

  return {
    locale,
    contentPack,
    kind,
    date: coerceString(body?.date),
    dateLabel: coerceString(body?.dateLabel),
    dayType: coerceString(body?.dayType, 'ordinary'),
    title: coerceString(body?.title),
    subtitle: coerceString(body?.subtitle),
    kicker: coerceString(body?.kicker),
    fallbackTitleEnding: coerceString(body?.fallbackTitleEnding),
    fallbackCardNote: coerceString(body?.fallbackCardNote),
    fallbackBlurbs: coerceStringArray(body?.fallbackBlurbs),
    themeDays: coerceStringArray(body?.themeDays),
    extraThemeDays: coerceStringArray(body?.extraThemeDays),
    seasonalTitles: coerceStringArray(body?.seasonalTitles),
    upcomingTitles: coerceStringArray(body?.upcomingTitles),
    upcomingHolidayName: coerceString(body?.upcomingHolidayName),
    nationalDaySummary: coerceString(body?.nationalDaySummary),
    allowHumor: coerceBoolean(body?.allowHumor, true),
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
