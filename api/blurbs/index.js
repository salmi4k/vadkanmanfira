const {
  canGenerateVariant,
  MAX_VARIANTS_PER_KEY,
  chooseVariant,
  createVariant,
  getCacheState,
  recordVariantUsage,
  saveCacheState,
} = require('../shared/cache');
const { normalizeRequestBody, isValidRequest } = require('../shared/blurbSchema');
const { generateBlurbBundle } = require('../shared/azureOpenAi');

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === null ? '' : JSON.stringify(body),
  };
}

async function tryGenerateVariant(request, cacheState) {
  try {
    return await generateBlurbBundle(request);
  } catch (error) {
    if (cacheState && cacheState.freshVariants.length > 0) {
      return null;
    }

    throw error;
  }
}

module.exports = async function blurbHandler(context, req) {
  try {
    const request = normalizeRequestBody(req.body || {});
    if (!isValidRequest(request)) {
      context.res = json(400, {
        error: 'Invalid request payload.',
      });
      return;
    }

    let cacheState = await getCacheState(request);
    let responseSource = 'cache';
    const wantsReroll = request.requestMode === 'reroll';
    const canGenerateNow = canGenerateVariant(cacheState);
    const shouldGenerateVariant =
      cacheState.freshVariants.length === 0
        ? canGenerateNow
        : wantsReroll && cacheState.variants.length < MAX_VARIANTS_PER_KEY && canGenerateNow;

    if (shouldGenerateVariant) {
      const generated = await tryGenerateVariant(request, cacheState);
      if (!generated || !generated.enabled || !generated.bundle) {
        if (!cacheState || cacheState.freshVariants.length === 0) {
          context.res = json(204, null);
          return;
        }
      } else {
        const generatedVariant = createVariant(generated.bundle, generated.model);
        let updatedVariants = cacheState ? [...cacheState.variants] : [];

        if (updatedVariants.length < MAX_VARIANTS_PER_KEY) {
          updatedVariants.push(generatedVariant);
        } else {
          const staleBundleIds = new Set(
            cacheState.staleVariants.map((variant) => variant.bundleId)
          );
          const replacementIndex = updatedVariants.findIndex((variant) =>
            staleBundleIds.has(variant.bundleId)
          );
          const targetIndex = replacementIndex >= 0 ? replacementIndex : 0;
          updatedVariants[targetIndex] = generatedVariant;
        }

        cacheState = {
          ...(cacheState || {}),
          variants: updatedVariants,
          freshVariants: updatedVariants.filter((variant) => {
            const generatedAtMs = Date.parse(variant.generatedAt);
            return !Number.isNaN(generatedAtMs) && Date.now() - generatedAtMs <= 15 * 60 * 1000;
          }),
          staleVariants: updatedVariants.filter((variant) => {
            const generatedAtMs = Date.parse(variant.generatedAt);
            return Number.isNaN(generatedAtMs) || Date.now() - generatedAtMs > 15 * 60 * 1000;
          }),
          createdAt: cacheState?.createdAt || generatedVariant.createdAt,
          lastGeneratedAt: generatedVariant.generatedAt,
        };
        responseSource = 'azure-openai';
      }
    }

    const selectedVariant = chooseVariant(
      cacheState ? cacheState.freshVariants : [],
      cacheState ? cacheState.lastBundleId : null
    );

    if (!selectedVariant) {
      context.res = json(204, null);
      return;
    }

    cacheState = recordVariantUsage(cacheState, selectedVariant);
    await saveCacheState(request, cacheState);

    context.res = json(200, {
      source: responseSource,
      titleEndings: selectedVariant.bundle.titleEndings,
      cardNotes: selectedVariant.bundle.cardNotes,
      blurbs: selectedVariant.bundle.blurbs,
      model: selectedVariant.model,
    });
  } catch (error) {
    if (context && context.log && typeof context.log.error === 'function') {
      context.log.error('Failed to produce AI blurbs', error);
    } else if (context && typeof context.log === 'function') {
      context.log('Failed to produce AI blurbs', error);
    }

    context.res = json(200, {
      source: 'fallback',
      error: 'ai_unavailable',
      titleEndings: [],
      cardNotes: [],
      blurbs: [],
    });
  }
};
