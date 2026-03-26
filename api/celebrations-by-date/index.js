const {
  getCelebrationDateEntry,
  localizeEntry,
  normalizeDatasetId,
  normalizeLocale,
} = require('../shared/publicCelebrations');

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify(body),
  };
}

module.exports = async function celebrationByDateHandler(context, req) {
  const locale = normalizeLocale(req.query.locale);
  const dataset = normalizeDatasetId(req.query.dataset);
  const dateLabel = context.bindingData.date;
  const entry = getCelebrationDateEntry(dateLabel, dataset);

  if (!entry) {
    context.res = json(404, {
      error: 'No celebration found for that date.',
      date: dateLabel,
    });
    return;
  }

  context.res = json(200, {
    dataset,
    ...localizeEntry(entry, locale, dataset),
  });
};
