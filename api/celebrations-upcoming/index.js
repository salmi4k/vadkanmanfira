const {
  getUpcomingCelebrationEntries,
  localizeEntry,
  normalizeDatasetId,
  normalizeLocale,
} = require('../shared/publicCelebrations');

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600',
    },
    body: JSON.stringify(body),
  };
}

module.exports = async function celebrationsUpcomingHandler(context, req) {
  const locale = normalizeLocale(req.query.locale);
  const dataset = normalizeDatasetId(req.query.dataset);
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const limit = Number.parseInt(req.query.limit, 10);
  const entries = getUpcomingCelebrationEntries(
    from,
    Number.isNaN(limit) ? 10 : limit,
    dataset
  ).map((entry) => localizeEntry(entry, locale, dataset));

  context.res = json(200, {
    dataset,
    from: from || null,
    count: entries.length,
    celebrations: entries,
  });
};
