const { getCachedBundle, setCachedBundle } = require('../shared/cache');
const { normalizeRequestBody, isValidRequest } = require('../shared/blurbSchema');
const { generateBlurbBundle } = require('../shared/azureOpenAi');

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
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

    const cached = await getCachedBundle(request);
    if (cached) {
      context.res = json(200, {
        source: 'cache',
        titleEndings: cached.titleEndings,
        cardNotes: cached.cardNotes,
        blurbs: cached.blurbs,
        model: cached.model,
      });
      return;
    }

    const generated = await generateBlurbBundle(request);
    if (!generated.enabled || !generated.bundle) {
      context.res = json(204, null);
      return;
    }

    await setCachedBundle(request, generated.bundle, generated.model);

    context.res = json(200, {
      source: 'azure-openai',
      titleEndings: generated.bundle.titleEndings,
      cardNotes: generated.bundle.cardNotes,
      blurbs: generated.bundle.blurbs,
      model: generated.model,
    });
  } catch (error) {
    if (context?.log && typeof context.log.error === 'function') {
      context.log.error('Failed to produce AI blurbs', error);
    } else if (typeof context?.log === 'function') {
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
