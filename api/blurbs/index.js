const {
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

    if (!cacheState) {
      const generated = await generateBlurbBundle(request);
      if (!generated.enabled || !generated.bundle) {
        context.res = json(204, null);
        return;
      }

      context.res = json(200, {
        source: 'azure-openai',
        titleEndings: generated.bundle.titleEndings,
        cardNotes: generated.bundle.cardNotes,
        blurbs: generated.bundle.blurbs,
        model: generated.model,
      });
      return;
    }

    const shouldGenerateVariant =
      cacheState.freshVariants.length === 0 ||
      cacheState.variants.length < MAX_VARIANTS_PER_KEY ||
      cacheState.staleVariants.length > 0;

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
          freshVariants: updatedVariants,
          staleVariants: [],
          createdAt: cacheState?.createdAt || generatedVariant.createdAt,
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
