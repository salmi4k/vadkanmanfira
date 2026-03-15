const crypto = require('crypto');

const CACHE_TABLE_NAME = 'blurbcache';
const LIBRARY_TABLE_NAME = 'blurblibrary';
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;
const MAX_VARIANTS_PER_KEY = 3;

function loadTableClient() {
  try {
    return require('@azure/data-tables').TableClient;
  } catch {
    return null;
  }
}

function getTableClient(tableName) {
  const connectionString = process.env.AZURE_TABLES_CONNECTION_STRING;
  const TableClient = loadTableClient();

  if (!connectionString || !TableClient) {
    return null;
  }

  return TableClient.fromConnectionString(connectionString, tableName);
}

function getCacheClient() {
  return getTableClient(CACHE_TABLE_NAME);
}

function getLibraryClient() {
  return getTableClient(LIBRARY_TABLE_NAME);
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

function buildRequestHash(request) {
  const hash = crypto.createHash('sha256');
  hash.update(
    JSON.stringify({
      v: 1,
      locale: request.locale,
      contentPack: request.contentPack,
      kind: request.kind,
      mood: request.mood,
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

function buildHotCacheEntityKey(request) {
  return {
    partitionKey: `${request.locale}|${request.contentPack}|${request.kind}`,
    rowKey: buildRequestHash(request),
  };
}

function createBundleId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return crypto.randomBytes(16).toString('hex');
}

function parseJsonArray(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function coerceBundle(value) {
  const source = value && typeof value === 'object' ? value : {};

  return {
    titleEndings: Array.isArray(source.titleEndings) ? source.titleEndings : [],
    cardNotes: Array.isArray(source.cardNotes) ? source.cardNotes : [],
    blurbs: Array.isArray(source.blurbs) ? source.blurbs : [],
  };
}

function isFreshVariant(variant, nowMs = Date.now()) {
  if (!variant || typeof variant.generatedAt !== 'string' || variant.generatedAt.length === 0) {
    return false;
  }

  const generatedAtMs = Date.parse(variant.generatedAt);
  if (Number.isNaN(generatedAtMs)) {
    return false;
  }

  return nowMs - generatedAtMs <= CACHE_MAX_AGE_MS;
}

function createVariant(bundle, model, generatedAt = new Date().toISOString()) {
  return {
    bundleId: createBundleId(),
    requestHash: null,
    generatedAt,
    model: model || 'unknown',
    useCount: 0,
    lastUsedAt: null,
    bundle: coerceBundle(bundle),
  };
}

function chooseVariant(variants, lastBundleId) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }

  const pool =
    variants.length > 1 ? variants.filter((variant) => variant.bundleId !== lastBundleId) : variants;

  return pool[Math.floor(Math.random() * pool.length)];
}

function buildBundleEntity(requestHash, variant) {
  return {
    partitionKey: requestHash,
    rowKey: variant.bundleId,
    requestHash,
    bundleId: variant.bundleId,
    generatedAt: variant.generatedAt,
    model: variant.model || 'unknown',
    useCount: Number.isFinite(variant.useCount) ? Number(variant.useCount) : 0,
    lastUsedAt:
      typeof variant.lastUsedAt === 'string' && variant.lastUsedAt.length > 0
        ? variant.lastUsedAt
        : null,
    titleEndingsJson: JSON.stringify(variant.bundle.titleEndings || []),
    cardNotesJson: JSON.stringify(variant.bundle.cardNotes || []),
    blurbsJson: JSON.stringify(variant.bundle.blurbs || []),
  };
}

function normalizeBundleEntity(entity, requestHash) {
  const bundle = coerceBundle({
    titleEndings: parseJsonArray(entity.titleEndingsJson),
    cardNotes: parseJsonArray(entity.cardNotesJson),
    blurbs: parseJsonArray(entity.blurbsJson),
  });

  if (
    bundle.titleEndings.length === 0 &&
    bundle.cardNotes.length === 0 &&
    bundle.blurbs.length === 0
  ) {
    return null;
  }

  return {
    bundleId:
      typeof entity.bundleId === 'string' && entity.bundleId.length > 0
        ? entity.bundleId
        : entity.rowKey,
    requestHash,
    generatedAt:
      typeof entity.generatedAt === 'string' && entity.generatedAt.length > 0
        ? entity.generatedAt
        : new Date().toISOString(),
    model:
      typeof entity.model === 'string' && entity.model.length > 0 ? entity.model : 'unknown',
    useCount: Number.isFinite(entity.useCount) ? Number(entity.useCount) : 0,
    lastUsedAt:
      typeof entity.lastUsedAt === 'string' && entity.lastUsedAt.length > 0
        ? entity.lastUsedAt
        : null,
    bundle,
  };
}

function buildLegacyVariants(hotEntity, requestHash) {
  const variantsFromVariantsJson = parseJsonArray(hotEntity.variantsJson)
    .map((variant) => {
      const source = variant && typeof variant === 'object' ? variant : {};
      const bundle = coerceBundle(source.bundle || source);
      if (
        bundle.titleEndings.length === 0 &&
        bundle.cardNotes.length === 0 &&
        bundle.blurbs.length === 0
      ) {
        return null;
      }

      return {
        bundleId:
          typeof source.bundleId === 'string' && source.bundleId.length > 0
            ? source.bundleId
            : typeof source.id === 'string' && source.id.length > 0
              ? source.id
              : createBundleId(),
        requestHash,
        generatedAt:
          typeof source.generatedAt === 'string' && source.generatedAt.length > 0
            ? source.generatedAt
            : typeof source.createdAt === 'string' && source.createdAt.length > 0
              ? source.createdAt
              : hotEntity.createdAt || new Date().toISOString(),
        model:
          typeof source.model === 'string' && source.model.length > 0
            ? source.model
            : hotEntity.model || 'unknown',
        useCount: Number.isFinite(source.useCount) ? Number(source.useCount) : 0,
        lastUsedAt:
          typeof source.lastUsedAt === 'string' && source.lastUsedAt.length > 0
            ? source.lastUsedAt
            : null,
        bundle,
      };
    })
    .filter(Boolean);

  if (variantsFromVariantsJson.length > 0) {
    return variantsFromVariantsJson;
  }

  const legacyBundle = coerceBundle({
    titleEndings: parseJsonArray(hotEntity.titleEndingsJson),
    cardNotes: parseJsonArray(hotEntity.cardNotesJson),
    blurbs: parseJsonArray(hotEntity.blurbsJson),
  });

  if (
    legacyBundle.titleEndings.length === 0 &&
    legacyBundle.cardNotes.length === 0 &&
    legacyBundle.blurbs.length === 0
  ) {
    return [];
  }

  return [
    {
      bundleId: createBundleId(),
      requestHash,
      generatedAt: hotEntity.createdAt || new Date().toISOString(),
      model: hotEntity.model || 'unknown',
      useCount: Number.isFinite(hotEntity.useCount) ? Number(hotEntity.useCount) : 0,
      lastUsedAt:
        typeof hotEntity.lastUsedAt === 'string' && hotEntity.lastUsedAt.length > 0
          ? hotEntity.lastUsedAt
          : null,
      bundle: legacyBundle,
    },
  ];
}

async function loadLibraryVariants(libraryClient, requestHash, bundleIds) {
  const variants = [];

  for (const bundleId of bundleIds) {
    try {
      const entity = await libraryClient.getEntity(requestHash, bundleId);
      const variant = normalizeBundleEntity(entity, requestHash);
      if (variant) {
        variants.push(variant);
      }
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
  }

  return variants;
}

function buildCacheStateFromHotEntity(hotEntity, variants, requestHash) {
  const freshVariants = variants.filter((variant) => isFreshVariant(variant));
  const staleVariants = variants.filter((variant) => !isFreshVariant(variant));

  return {
    requestHash,
    variants,
    freshVariants,
    staleVariants,
    useCount: Number.isFinite(hotEntity.useCount) ? Number(hotEntity.useCount) : 0,
    lastUsedAt:
      typeof hotEntity.lastUsedAt === 'string' && hotEntity.lastUsedAt.length > 0
        ? hotEntity.lastUsedAt
        : null,
    lastBundleId:
      typeof hotEntity.lastBundleId === 'string' && hotEntity.lastBundleId.length > 0
        ? hotEntity.lastBundleId
        : null,
    createdAt:
      typeof hotEntity.createdAt === 'string' && hotEntity.createdAt.length > 0
        ? hotEntity.createdAt
        : null,
  };
}

async function getCacheState(request) {
  const cacheClient = getCacheClient();
  const libraryClient = getLibraryClient();

  if (!cacheClient || !libraryClient) {
    return null;
  }

  const entityKey = buildHotCacheEntityKey(request);
  const requestHash = entityKey.rowKey;

  try {
    const hotEntity = await cacheClient.getEntity(entityKey.partitionKey, entityKey.rowKey);
    const bundleIds = parseJsonArray(hotEntity.bundleIdsJson).filter(
      (value) => typeof value === 'string' && value.length > 0
    );

    let variants = await loadLibraryVariants(libraryClient, requestHash, bundleIds);
    if (variants.length === 0) {
      variants = buildLegacyVariants(hotEntity, requestHash);
    }

    return buildCacheStateFromHotEntity(hotEntity, variants, requestHash);
  } catch (error) {
    if (error.statusCode === 404) {
      return {
        requestHash,
        variants: [],
        freshVariants: [],
        staleVariants: [],
        useCount: 0,
        lastUsedAt: null,
        lastBundleId: null,
        createdAt: null,
      };
    }

    throw error;
  }
}

async function saveCacheState(request, state) {
  const cacheClient = getCacheClient();
  const libraryClient = getLibraryClient();

  if (!cacheClient || !libraryClient) {
    return;
  }

  await Promise.all([ensureTable(cacheClient), ensureTable(libraryClient)]);

  const entityKey = buildHotCacheEntityKey(request);
  const requestHash = state.requestHash || entityKey.rowKey;
  const variants = Array.isArray(state.variants) ? state.variants : [];
  const nowIso = new Date().toISOString();
  const createdAt =
    typeof state.createdAt === 'string' && state.createdAt.length > 0 ? state.createdAt : nowIso;

  for (const variant of variants) {
    variant.requestHash = requestHash;
  }

  await Promise.all(
    variants.map((variant) => libraryClient.upsertEntity(buildBundleEntity(requestHash, variant)))
  );

  await cacheClient.upsertEntity({
    partitionKey: entityKey.partitionKey,
    rowKey: entityKey.rowKey,
    requestHash,
    createdAt,
    updatedAt: nowIso,
    lastUsedAt:
      typeof state.lastUsedAt === 'string' && state.lastUsedAt.length > 0 ? state.lastUsedAt : null,
    useCount: Number.isFinite(state.useCount) ? Number(state.useCount) : 0,
    lastBundleId:
      typeof state.lastBundleId === 'string' && state.lastBundleId.length > 0
        ? state.lastBundleId
        : null,
    variantCount: variants.length,
    bundleIdsJson: JSON.stringify(variants.map((variant) => variant.bundleId)),
  });
}

function recordVariantUsage(state, variant, usedAt = new Date().toISOString()) {
  if (!state || !variant) {
    return state;
  }

  const updatedVariants = state.variants.map((candidate) => {
    if (candidate.bundleId !== variant.bundleId) {
      return candidate;
    }

    return {
      ...candidate,
      useCount: (candidate.useCount || 0) + 1,
      lastUsedAt: usedAt,
    };
  });

  return {
    ...state,
    variants: updatedVariants,
    freshVariants: updatedVariants.filter((candidate) => isFreshVariant(candidate)),
    staleVariants: updatedVariants.filter((candidate) => !isFreshVariant(candidate)),
    useCount: (state.useCount || 0) + 1,
    lastUsedAt: usedAt,
    lastBundleId: variant.bundleId,
  };
}

module.exports = {
  CACHE_MAX_AGE_MS,
  MAX_VARIANTS_PER_KEY,
  buildRequestHash,
  chooseVariant,
  createVariant,
  getCacheState,
  recordVariantUsage,
  saveCacheState,
};
