const crypto = require('crypto');
const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'blurbcache';

function getCacheClient() {
  const connectionString = process.env.AZURE_TABLES_CONNECTION_STRING;
  if (!connectionString) {
    return null;
  }

  return TableClient.fromConnectionString(connectionString, TABLE_NAME);
}

async function ensureTable(client) {
  if (!client) {
    return;
  }

  await client.createTable().catch((error) => {
    if (error.statusCode !== 409) {
      throw error;
    }
  });
}

function buildCacheKey(request) {
  const hash = crypto.createHash('sha256');
  hash.update(
    JSON.stringify({
      v: 1,
      locale: request.locale,
      contentPack: request.contentPack,
      kind: request.kind,
      date: request.date,
      dayType: request.dayType,
      title: request.title,
      subtitle: request.subtitle,
      kicker: request.kicker,
      fallbackTitleEnding: request.fallbackTitleEnding,
      fallbackCardNote: request.fallbackCardNote,
      fallbackBlurbs: request.fallbackBlurbs,
      themeDays: request.themeDays,
      extraThemeDays: request.extraThemeDays,
      seasonalTitles: request.seasonalTitles,
      upcomingTitles: request.upcomingTitles,
      upcomingHolidayName: request.upcomingHolidayName,
      nationalDaySummary: request.nationalDaySummary,
    })
  );

  return hash.digest('hex');
}

function buildEntityKey(request) {
  return {
    partitionKey: `${request.locale}|${request.contentPack}|${request.kind}`,
    rowKey: buildCacheKey(request),
  };
}

async function getCachedBundle(request) {
  const client = getCacheClient();
  if (!client) {
    return null;
  }

  const { partitionKey, rowKey } = buildEntityKey(request);

  try {
    const entity = await client.getEntity(partitionKey, rowKey);
    return {
      source: 'cache',
      titleEndings: JSON.parse(entity.titleEndingsJson || '[]'),
      cardNotes: JSON.parse(entity.cardNotesJson || '[]'),
      blurbs: JSON.parse(entity.blurbsJson || '[]'),
      cachedAt: entity.createdAt || null,
      model: entity.model || null,
    };
  } catch (error) {
    if (error.statusCode === 404) {
      return null;
    }

    throw error;
  }
}

async function setCachedBundle(request, bundle, model) {
  const client = getCacheClient();
  if (!client) {
    return;
  }

  await ensureTable(client);

  const { partitionKey, rowKey } = buildEntityKey(request);

  await client.upsertEntity({
    partitionKey,
    rowKey,
    createdAt: new Date().toISOString(),
    model: model || 'unknown',
    titleEndingsJson: JSON.stringify(bundle.titleEndings || []),
    cardNotesJson: JSON.stringify(bundle.cardNotes || []),
    blurbsJson: JSON.stringify(bundle.blurbs || []),
  });
}

module.exports = {
  getCachedBundle,
  setCachedBundle,
};
