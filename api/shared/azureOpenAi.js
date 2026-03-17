const { buildSystemPrompt, buildUserPrompt } = require('./prompt');

function getAzureOpenAiConfig() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-10-21';

  if (!endpoint || !apiKey || !deployment) {
    return null;
  }

  return {
    endpoint: endpoint.replace(/\/$/, ''),
    apiKey,
    deployment,
    apiVersion,
  };
}

function parseJsonResponse(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Model response did not contain JSON.');
    }

    return JSON.parse(match[0]);
  }
}

function sanitizeBundle(bundle, request) {
  const sourceBundle = bundle && typeof bundle === 'object' ? bundle : {};
  const titleEndings = Array.isArray(sourceBundle.titleEndings)
    ? sourceBundle.titleEndings.filter((value) => typeof value === 'string' && value.trim().length > 0)
    : [];
  const cardNotes = Array.isArray(sourceBundle.cardNotes)
    ? sourceBundle.cardNotes.filter((value) => typeof value === 'string' && value.trim().length > 0)
    : [];
  const blurbs = Array.isArray(sourceBundle.blurbs)
    ? sourceBundle.blurbs.filter((value) => typeof value === 'string' && value.trim().length > 0)
    : [];

  return {
    titleEndings:
      request.kind === 'themeDay' ? titleEndings.slice(0, 8) : [],
    cardNotes:
      request.kind === 'themeDay' ? cardNotes.slice(0, 8) : [],
    blurbs: blurbs.slice(0, 10),
  };
}

async function generateBlurbBundle(request) {
  const config = getAzureOpenAiConfig();
  if (!config) {
    return {
      enabled: false,
      model: null,
      bundle: null,
    };
  }

  const url =
    `${config.endpoint}/openai/deployments/${config.deployment}/chat/completions` +
    `?api-version=${config.apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(request) },
      ],
      temperature: 0.9,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Azure OpenAI request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const content =
    payload &&
    payload.choices &&
    payload.choices[0] &&
    payload.choices[0].message &&
    payload.choices[0].message.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Azure OpenAI returned no content.');
  }

  return {
    enabled: true,
    model: (payload && payload.model) || config.deployment,
    bundle: sanitizeBundle(parseJsonResponse(content), request),
  };
}

module.exports = {
  generateBlurbBundle,
};
