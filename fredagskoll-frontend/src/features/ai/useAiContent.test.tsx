import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAiContent } from './useAiContent';
import { fetchAiBlurbBundle, type AiBlurbBundle, type AiBlurbRequest } from './aiBlurbs';

vi.mock('./aiBlurbs', () => ({
  fetchAiBlurbBundle: vi.fn(),
}));

const mockedFetchAiBlurbBundle = vi.mocked(fetchAiBlurbBundle);

const baseRequest: AiBlurbRequest = {
  locale: 'sv',
  contentPack: 'public',
  kind: 'themeDay',
  mood: 'warm',
  requestMode: 'default',
  date: '2026-03-26',
  dateLabel: '26 mars 2026',
  dayType: 'ordinary',
  title: 'Världsteaterdagen',
  kicker: 'Inofficiell temadag',
  fallbackTitleEnding: 'Det får väl bära dagen då.',
  fallbackCardNote: 'Ingen officiell högtid, men tillräckligt mycket energi ändå.',
  fallbackBlurbs: ['Lokal reservtext.'],
  themeDays: ['Världsteaterdagen'],
  extraThemeDays: [],
  seasonalTitles: [],
  upcomingTitles: [],
  allowHumor: true,
};

function buildBundle(overrides: Partial<AiBlurbBundle> = {}): AiBlurbBundle {
  return {
    source: 'azure-openai',
    titleEndings: ['AI-slutrad.'],
    cardNotes: ['AI-notis.'],
    blurbs: ['AI-ursäkt ett.', 'AI-ursäkt två.'],
    ...overrides,
  };
}

function renderAiContent() {
  return renderHook(() =>
    useAiContent({
      aiRequest: baseRequest,
      ordinaryBlurb: 'Lokal reservtext.',
      locale: 'sv',
      mood: 'warm',
      selectedDate: '2026-03-26',
      celebration: null,
      themeDayBlurbs: ['Lokal temadagsblurb.'],
      dayType: 'ordinary',
      isWeekend: false,
      hasThemeDays: true,
      themeDayDisplayTitle: 'Världsteaterdagen',
    })
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  mockedFetchAiBlurbBundle.mockReset();
});

test('reports loading and idle before the first ai bundle resolves', async () => {
  let resolveBundle: (value: AiBlurbBundle | null) => void = () => undefined;
  const pendingBundle = new Promise<AiBlurbBundle | null>((resolve) => {
    resolveBundle = resolve;
  });
  mockedFetchAiBlurbBundle.mockReturnValueOnce(pendingBundle);

  const { result } = renderAiContent();

  expect(result.current.isAiBundleLoading).toBe(true);
  expect(result.current.observability.resolvedSource).toEqual({
    status: 'loading',
    source: 'unknown',
  });
  expect(result.current.observability.rerollOutcome).toEqual({
    status: 'idle',
  });

  resolveBundle(buildBundle());

  await waitFor(() => expect(result.current.isAiBundleLoading).toBe(false));

  expect(result.current.observability.resolvedSource).toEqual({
    status: 'resolved',
    source: 'azure-openai',
  });
  expect(result.current.observability.rerollOutcome).toEqual({
    status: 'idle',
  });
});

test('reports fresh-ai after reroll returns a new azure-openai bundle', async () => {
  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce(buildBundle())
    .mockResolvedValueOnce(
      buildBundle({
        titleEndings: ['Ny AI-vinkel.'],
        cardNotes: ['Ny AI-notis.'],
        blurbs: ['Ny AI-ursäkt.'],
      })
    );

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  const { result } = renderAiContent();

  await waitFor(() => expect(result.current.isAiBundleLoading).toBe(false));
  expect(result.current.observability.resolvedSource).toEqual({
    status: 'resolved',
    source: 'azure-openai',
  });

  await act(async () => {
    await result.current.handleReroll();
  });

  expect(mockedFetchAiBlurbBundle).toHaveBeenLastCalledWith(
    expect.objectContaining({ requestMode: 'reroll' }),
    undefined
  );
  expect(result.current.observability.rerollOutcome).toEqual({
    status: 'fresh-ai',
  });
  expect(result.current.blurb).toBe('Ny AI-ursäkt.');
  expect(result.current.themeDayTitleEnding).toBe('Ny AI-vinkel.');
  expect(result.current.themeDayCardNote).toBe('Ny AI-notis.');

  randomSpy.mockRestore();
});

test('reports reused-ai when reroll returns cached content without fresh blurbs', async () => {
  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce(buildBundle())
    .mockResolvedValueOnce(
      buildBundle({
        source: 'cache',
        titleEndings: ['Cache-vinkel.'],
        cardNotes: ['Cache-notis.'],
        blurbs: [],
      })
    );

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
  const { result } = renderAiContent();

  await waitFor(() => expect(result.current.isAiBundleLoading).toBe(false));

  await act(async () => {
    await result.current.handleReroll();
  });

  expect(result.current.observability.rerollOutcome).toEqual({
    status: 'reused-ai',
  });
  expect(result.current.observability.resolvedSource).toEqual({
    status: 'resolved',
    source: 'cache',
  });
  expect(result.current.themeDayTitleEnding).toBe('Cache-vinkel.');
  expect(result.current.themeDayCardNote).toBe('Cache-notis.');
  expect(result.current.blurb).toBe('AI-ursäkt ett.');

  randomSpy.mockRestore();
});

test('reports local-fallback when reroll cannot produce a usable bundle', async () => {
  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce(buildBundle())
    .mockResolvedValueOnce(null);

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  const { result } = renderAiContent();

  await waitFor(() => expect(result.current.isAiBundleLoading).toBe(false));

  await act(async () => {
    await result.current.handleReroll();
  });

  expect(result.current.observability.rerollOutcome).toEqual({
    status: 'local-fallback',
  });
  expect(result.current.observability.resolvedSource).toEqual({
    status: 'resolved',
    source: 'azure-openai',
  });
  expect(result.current.blurb).toBe('AI-ursäkt två.');

  randomSpy.mockRestore();
});
