const {
  buildChatText,
  getCelebrationDateEntry,
  getTodayCelebrationEntry,
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

module.exports = async function integrationsChatCelebrateHandler(context, req) {
  const locale = normalizeLocale(req.query.locale || (req.body && req.body.locale));
  const dataset = normalizeDatasetId(req.query.dataset || (req.body && req.body.dataset));
  const platform = typeof req.query.platform === 'string' ? req.query.platform : 'text';
  const dateLabel =
    (typeof req.query.date === 'string' && req.query.date) ||
    (req.body && typeof req.body.date === 'string' ? req.body.date : null);
  const entry = dateLabel
    ? getCelebrationDateEntry(dateLabel, dataset)
    : getTodayCelebrationEntry(new Date(), dataset);
  const text = buildChatText(entry, locale, dataset);

  if (platform === 'slack') {
    context.res = json(200, {
      response_type: 'in_channel',
      dataset,
      text,
    });
    return;
  }

  if (platform === 'discord') {
    context.res = json(200, {
      content: text,
      dataset,
    });
    return;
  }

  context.res = json(200, {
    text,
    dataset,
  });
};
