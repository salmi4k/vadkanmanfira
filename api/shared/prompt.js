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

function buildThemeCollisionGuidance(request) {
  const allThemeDays = [...request.themeDays, ...request.extraThemeDays];

  if (allThemeDays.length <= 1) {
    return null;
  }

  return [
    `There are ${allThemeDays.length} theme-day angles in play: ${allThemeDays.join(', ')}.`,
    'Do not treat them as a list.',
    'Choose one dominant angle and, at most, one supporting contrast.',
    'Turn the collision between them into one believable scene, ritual, workplace behavior, or domestic compromise.',
    'At least 4 blurbs should combine two or more of them into one plausible social truth instead of enumerating observances.',
  ].join(' ');
}

function buildKindGuidance(request) {
  if (request.kind === 'celebration') {
    return [
      'This is a real celebration or holiday, so the copy should feel culturally anchored rather than invented from thin air.',
      'Use recognizable rituals, foods, timing, travel patterns, family behavior, flags, awkward host duties, or public mood shifts.',
      'The joke should come from how people actually behave when this day arrives.',
    ].join(' ');
  }

  if (request.kind === 'themeDay') {
    return [
      'This is a theme-day driven date, so the humor should come from the collision between niche observances and normal life.',
      'Make it feel like an observant person noticed how the calendar is trying too hard and decided to make that useful.',
    ].join(' ');
  }

  return [
    'This is an ordinary day or near-ordinary day, so the line should find dignity, pettiness, or ceremonial energy in small social realities.',
    'Do not overinflate nothingness; find one plausible reason the date still feels mildly charged.',
  ].join(' ');
}

function buildEditorialExamples() {
  return [
    'Short examples of the level of specificity and synthesis wanted:',
    '- Good celebration angle: "By three o clock the flag is still up, the cake is gone, and everyone is suddenly prepared to be generous about the country for another hour."',
    '- Good theme-day collision angle: "When waffle day lands in the same vicinity as budget anxiety and spring optimism, the batter starts sounding like policy."',
    '- Good ordinary-day angle: "Nothing historic has happened, but the inbox is tense, the weather has opinions, and that is enough structure for a weekday."',
    '- Bad angle: "Today is Waffle Day and people eat waffles."',
  ].join('\n');
}

function buildSystemPrompt() {
  return [
    'You write sharp, vivid microcopy for a humorous Swedish calendar app.',
    'The voice should feel observant, human, socially intelligent, and slightly ceremonial rather than templated.',
    'The default tone is officious, ironic, witty, and specific unless the requested mood says otherwise.',
    'Write like an excellent columnist, copywriter, and art director working together on tiny pieces of language.',
    'Avoid generic cheerfulness, marketing fluff, filler, emoji, and flat summaries of what the day is called.',
    'Never joke about tragedy, disease, disability, violence, or memorial-type observances.',
    'Return valid JSON only.',
    'Keep the language natural and idiomatic for the requested locale.',
    'Do not directly translate Swedish phrases into awkward English or Portuguese.',
    'Prefer concrete social detail, mild surprise, and one clean point of view per line.',
    'Each blurb should capture one dominant social truth about the date and make that truth feel inevitable.',
    'The best lines should feel quotable, slightly dangerous, and immediately shareable.',
    'Avoid openings like "Today is..." or "This day celebrates..." unless there is a very strong reason.',
    'Do not sound like fallback copy, placeholder copy, or generic content writing.',
    'Never write list-shaped humor, calendar recap copy, or cheerful filler that could fit any date.',
  ].join(' ');
}

function buildUserPrompt(request) {
  const lines = [
    `Locale: ${getLocaleLabel(request.locale)}`,
    `Content pack: ${request.contentPack}`,
    `Kind: ${request.kind}`,
    `Mood: ${request.mood}`,
    `Date: ${request.date}`,
    `Human date label: ${request.dateLabel}`,
    `Day type: ${request.dayType}`,
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

  const collisionGuidance = buildThemeCollisionGuidance(request);
  if (collisionGuidance) {
    lines.push(`Theme-day collision guidance: ${collisionGuidance}`);
  }

  if (request.upcomingHolidayName) {
    lines.push(`Upcoming holiday this week: ${request.upcomingHolidayName}`);
  }

  if (request.seasonalTitles.length > 0) {
    lines.push(`Seasonal notes: ${request.seasonalTitles.join(' | ')}`);
  }

  if (request.upcomingTitles.length > 0) {
    lines.push(`Upcoming notable context: ${request.upcomingTitles.join(' | ')}`);
  }

  if (request.nationalDaySummary) {
    lines.push(`World national day context: ${request.nationalDaySummary}`);
  }

  lines.push(`Reference title ending: ${request.fallbackTitleEnding || '(none)'}`);
  lines.push(`Reference card note: ${request.fallbackCardNote || '(none)'}`);
  lines.push(
    `Reference blurbs: ${
      request.fallbackBlurbs.length > 0 ? request.fallbackBlurbs.join(' | ') : '(none)'
    }`
  );
  lines.push(`Mood guidance: ${getMoodGuidance(request.mood)}`);
  lines.push(`Kind-specific guidance: ${buildKindGuidance(request)}`);
  lines.push('Use the reference text only as grounding for topic and rhythm, not as a template to paraphrase.');
  lines.push('Treat the date itself as an editorial constraint: the copy should sound socially plausible for that exact moment in the year.');
  lines.push('Use actual lived details when useful: weather, office behavior, fika logic, family chat energy, travel plans, seasonal food, after-work rituals, and mild social bargaining.');
  lines.push('The humor should come from recognition, contrast, or ceremonial overstatement, not randomness.');
  lines.push('When several plausible angles exist, commit to the sharpest one instead of trying to cover the whole calendar.');
  lines.push('At least a few blurbs should feel good enough to screenshot and send to a friend or a team chat.');
  lines.push(buildEditorialExamples());

  if (request.kind === 'themeDay') {
    lines.push('Generate 8 alternative short title endings, 8 alternative supporting card notes, and 10 blurbs.');
    lines.push('Title endings must be short, sharp, and work as a second line under the main theme-day title.');
    lines.push('Card notes should be one sentence each, alive, precise, slightly amused, and aware of the strongest theme collision when several theme days coexist.');
    lines.push('Do not merely restate the theme-day names. Synthesize them into a point of view.');
  } else {
    lines.push('Generate 10 blurbs.');
    lines.push('Return empty arrays for titleEndings and cardNotes.');
  }

  lines.push('Also generate one short headline, one editorialAngle sentence explaining the chosen point of view, one shareCaption, and one integrationSummary.');
  lines.push('headline should feel like a premium one-line verdict for the date.');
  lines.push('editorialAngle should explain the social observation in one concise sentence.');
  lines.push('shareCaption should be compact and screenshot-worthy.');
  lines.push('integrationSummary should be a clean, channel-safe sentence for Slack, Teams, email, or widgets.');
  lines.push('Blurb requirements: 1-2 sentences each, witty, specific, office-aware, emotionally real, and not repetitive.');
  lines.push('Each blurb should feel like it was written for this exact date, not a reusable calendar fragment.');
  lines.push('Across the 10 blurbs, vary the angle: some observational, some ceremonial, some social, some slightly petty, some warmly accurate.');
  lines.push('For official holidays or named celebrations, anchor the copy in recognizable rituals or behaviors instead of generic praise.');
  lines.push('When several theme days coexist, mine their contradiction, overlap, or accidental harmony for comedy.');
  lines.push('Silently reject any blurb that could be summarized as "today is X so people do X".');
  lines.push('Prefer lines that begin inside the scene, not before it.');
  lines.push('Do not mention being an AI, do not explain the joke, and do not use hashtags.');
  lines.push('Return JSON in this shape: {"headline":"...","editorialAngle":"...","shareCaption":"...","integrationSummary":"...","titleEndings":["..."],"cardNotes":["..."],"blurbs":["..."]}');

  return lines.join('\n');
}

module.exports = {
  buildSystemPrompt,
  buildUserPrompt,
};
