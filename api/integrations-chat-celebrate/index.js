const {
  buildCelebrationLinks,
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

function buildSlackBlocks(entry, locale, dataset) {
  const text = buildChatText(entry, locale, dataset);
  const links = buildCelebrationLinks(entry);

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${text.split('\n')[0]}*`,
      },
    },
  ];

  const detailLines = text.split('\n').slice(1);
  if (detailLines.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: detailLines.join('\n'),
      },
    });
  }

  if (links.appUrl || links.shareCardUrl) {
    blocks.push({
      type: 'actions',
      elements: [
        links.appUrl
          ? {
              type: 'button',
              text: { type: 'plain_text', text: 'Open day' },
              url: links.appUrl,
            }
          : null,
        links.shareCardUrl
          ? {
              type: 'button',
              text: { type: 'plain_text', text: 'Share card' },
              url: links.shareCardUrl,
            }
          : null,
      ].filter(Boolean),
    });
  }

  return {
    response_type: 'in_channel',
    dataset,
    text,
    blocks,
  };
}

function buildTeamsCard(entry, locale, dataset) {
  const text = buildChatText(entry, locale, dataset);
  const lines = text.split('\n');
  const links = buildCelebrationLinks(entry);

  return {
    type: 'message',
    dataset,
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.5',
          body: [
            {
              type: 'TextBlock',
              text: lines[0],
              weight: 'Bolder',
              wrap: true,
              size: 'Medium',
            },
            ...lines.slice(1).map((line) => ({
              type: 'TextBlock',
              text: line,
              wrap: true,
              spacing: 'Small',
            })),
          ],
          actions: [
            links.appUrl
              ? {
                  type: 'Action.OpenUrl',
                  title: 'Open day',
                  url: links.appUrl,
                }
              : null,
            links.shareCardUrl
              ? {
                  type: 'Action.OpenUrl',
                  title: 'Share card',
                  url: links.shareCardUrl,
                }
              : null,
          ].filter(Boolean),
        },
      },
    ],
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

  if (platform === 'slack-blocks') {
    context.res = json(200, buildSlackBlocks(entry, locale, dataset));
    return;
  }

  if (platform === 'teams') {
    context.res = json(200, buildTeamsCard(entry, locale, dataset));
    return;
  }

  context.res = json(200, {
    text,
    dataset,
    links: buildCelebrationLinks(entry),
  });
};
