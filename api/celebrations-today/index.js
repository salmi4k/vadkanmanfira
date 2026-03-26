const {
  getTodayCelebrationEntry,
  localizeEntry,
  normalizeDatasetId,
  normalizeLocale,
} = require('../shared/publicCelebrations');

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
    body: JSON.stringify(body),
  };
}

module.exports = async function celebrationTodayHandler(context, req) {
  const locale = normalizeLocale(req.query.locale);
  const dataset = normalizeDatasetId(req.query.dataset);
  const entry = getTodayCelebrationEntry(new Date(), dataset);

  if (!entry) {
    context.res = json(404, {
      error: 'No celebration found for today.',
    });
    return;
  }

  context.res = json(200, {
    dataset,
    ...localizeEntry(entry, locale, dataset),
  });
};
