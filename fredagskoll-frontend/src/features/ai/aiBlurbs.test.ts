import { fetchAiBlurbBundle, type AiBlurbRequest } from './aiBlurbs';

const request: AiBlurbRequest = {
  locale: 'sv',
  contentPack: 'public',
  kind: 'ordinary',
  mood: 'dry',
  date: '2026-03-15',
  dateLabel: '15 mars 2026',
  dayType: 'ordinary',
  title: 'Vanlig dag',
  subtitle: 'Sondag',
  kicker: 'En helt vanlig sondag',
  fallbackTitleEnding: 'fortfarande bara sondag',
  fallbackCardNote: 'Det har ar inte en officiell svensk helgdag.',
  fallbackBlurbs: ['En vanlig dag.'],
  themeDays: [],
  extraThemeDays: [],
  seasonalTitles: [],
  upcomingTitles: [],
  allowHumor: true,
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('posts ai blurb requests to the same-origin managed api path', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      source: 'cache',
      titleEndings: [],
      cardNotes: [],
      blurbs: ['AI text'],
    }),
  } as Response);

  await fetchAiBlurbBundle(request);

  expect(fetchSpy).toHaveBeenCalledWith(
    '/api/blurbs',
    expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
});
