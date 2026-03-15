function getLocaleLabel(locale) {
  switch (locale) {
    case 'en':
      return 'English';
    case 'pt-BR':
      return 'Brazilian Portuguese';
    default:
      return 'Swedish';
  }
}

function getMoodGuidance(mood) {
  switch (mood) {
    case 'cheerful':
      return 'Make the tone lightly upbeat, generous, and playful without becoming sugary or generic.';
    case 'chaotic':
      return 'Make the tone lively, unruly, and slightly frazzled, but still readable and controlled.';
    case 'formal':
      return 'Make the tone drier, tidier, and more ceremonially officious than usual.';
    case 'absurd':
      return 'Lean into surreal observations and odd juxtapositions while keeping the copy concise.';
    case 'warm':
      return 'Make the tone warmer, more humane, and gently amused without losing sharpness.';
    default:
      return 'Keep the tone dry, witty, officious, ironic, and observant.';
  }
}

function buildSystemPrompt() {
  return [
    'You write dry, witty microcopy for a humorous Swedish calendar app.',
    'The default tone is officious, ironic, and observant unless the requested mood says otherwise.',
    'Avoid generic cheerfulness, marketing fluff, and emoji.',
    'Never joke about tragedy, disease, disability, violence, or memorial-type observances.',
    'Return valid JSON only.',
    'Keep the language natural and idiomatic for the requested locale.',
    'Do not directly translate Swedish phrases into awkward English or Portuguese.',
  ].join(' ');
}

function buildUserPrompt(request) {
  const lines = [
    `Locale: ${getLocaleLabel(request.locale)}`,
    `Content pack: ${request.contentPack}`,
    `Kind: ${request.kind}`,
    `Mood: ${request.mood}`,
    `Date: ${request.date}`,
    `Primary title: ${request.title}`,
  ];

  if (request.subtitle) {
    lines.push(`Existing subtitle: ${request.subtitle}`);
  }

  if (request.kicker) {
    lines.push(`Kicker: ${request.kicker}`);
  }

  if (request.themeDays.length > 0) {
    lines.push(`Theme days: ${request.themeDays.join(', ')}`);
  }

  if (request.extraThemeDays.length > 0) {
    lines.push(`Extra theme days: ${request.extraThemeDays.join(', ')}`);
  }

  if (request.upcomingHolidayName) {
    lines.push(`Upcoming holiday this week: ${request.upcomingHolidayName}`);
  }

  if (request.seasonalTitles.length > 0) {
    lines.push(`Seasonal notes: ${request.seasonalTitles.join(', ')}`);
  }

  if (request.upcomingTitles.length > 0) {
    lines.push(`Upcoming notable titles: ${request.upcomingTitles.join(', ')}`);
  }

  if (request.nationalDaySummary) {
    lines.push(`World national day context: ${request.nationalDaySummary}`);
  }

  lines.push(`Fallback title ending: ${request.fallbackTitleEnding || '(none)'}`);
  lines.push(`Fallback card note: ${request.fallbackCardNote || '(none)'}`);
  lines.push(`Fallback blurbs: ${request.fallbackBlurbs.join(' | ')}`);
  lines.push(`Mood guidance: ${getMoodGuidance(request.mood)}`);

  if (request.kind === 'themeDay') {
    lines.push('Generate 6 alternative short title endings, 6 alternative supporting card notes, and 8 blurbs.');
    lines.push('Title endings must be short, sharp, and work as a second line under the main theme-day title.');
    lines.push('Card notes should be one sentence each, slightly officious and amused.');
  } else {
    lines.push('Generate 8 blurbs.');
    lines.push('Return empty arrays for titleEndings and cardNotes.');
  }

  lines.push('Blurb requirements: 1-2 sentences each, witty, specific, office-aware, and not repetitive.');
  lines.push('Do not mention being an AI, do not explain the joke, and do not use hashtags.');
  lines.push('Return JSON in this shape: {"titleEndings":["..."],"cardNotes":["..."],"blurbs":["..."]}');

  return lines.join('\n');
}

module.exports = {
  buildSystemPrompt,
  buildUserPrompt,
};
