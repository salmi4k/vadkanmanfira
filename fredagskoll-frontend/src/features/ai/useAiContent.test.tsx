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

afterEach(() => {
  vi.restoreAllMocks();
  mockedFetchAiBlurbBundle.mockReset();
});

test('keeps using ai content when reroll returns metadata but no new blurbs', async () => {
  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce(buildBundle())
    .mockResolvedValueOnce(
      buildBundle({
        titleEndings: ['Ny AI-vinkel.'],
        cardNotes: ['Ny AI-notis.'],
        blurbs: [],
      })
    );

  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

  const { result } = renderHook(() =>
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

  await waitFor(() => expect(result.current.isAiBundleLoading).toBe(false));

  expect(result.current.blurb).toBe('AI-ursäkt ett.');
  expect(result.current.themeDayTitleEnding).toBe('AI-slutrad.');
  expect(result.current.themeDayCardNote).toBe('AI-notis.');
  expect(result.current.canReroll).toBe(true);

  randomSpy.mockReturnValue(0.99);

  await act(async () => {
    await result.current.handleReroll();
  });

  expect(mockedFetchAiBlurbBundle).toHaveBeenLastCalledWith(
    expect.objectContaining({ requestMode: 'reroll' }),
    undefined
  );
  expect(result.current.themeDayTitleEnding).toBe('Ny AI-vinkel.');
  expect(result.current.themeDayCardNote).toBe('Ny AI-notis.');
  expect(result.current.currentBlurbs).toEqual(['AI-ursäkt ett.', 'AI-ursäkt två.']);
  expect(result.current.blurb).toBe('AI-ursäkt två.');
  expect(result.current.blurb).not.toBe('Lokal reservtext.');
});
