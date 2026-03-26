import { ContentPack } from '../../contentPack';
import { Locale } from '../../locale';
import { Mood } from '../../mood';

export type AiBlurbRequest = {
  locale: Locale;
  contentPack: ContentPack;
  kind: 'celebration' | 'themeDay' | 'ordinary';
  mood: Mood;
  requestMode?: 'default' | 'reroll';
  date: string;
  dateLabel: string;
  dayType: string;
  title: string;
  subtitle?: string;
  kicker: string;
  fallbackTitleEnding?: string;
  fallbackCardNote?: string;
  fallbackBlurbs: string[];
  themeDays: string[];
  extraThemeDays: string[];
  seasonalTitles: string[];
  upcomingTitles: string[];
  upcomingHolidayName?: string;
  nationalDaySummary?: string;
  allowHumor: boolean;
};

export type AiBlurbBundle = {
  source: 'cache' | 'azure-openai' | 'fallback';
  headline?: string;
  editorialAngle?: string;
  shareCaption?: string;
  integrationSummary?: string;
  titleEndings: string[];
  cardNotes: string[];
  blurbs: string[];
  model?: string | null;
};

export async function fetchAiBlurbBundle(
  request: AiBlurbRequest,
  signal?: AbortSignal
): Promise<AiBlurbBundle | null> {
  const response = await fetch('/api/blurbs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal,
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`AI blurb request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AiBlurbBundle;
  if (
    payload.blurbs.length === 0 &&
    payload.titleEndings.length === 0 &&
    payload.cardNotes.length === 0
  ) {
    return null;
  }

  return payload;
}
