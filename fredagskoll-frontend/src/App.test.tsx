import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchAiBlurbBundle } from './aiBlurbs';
import { buildInfo } from './buildInfo.generated';
import { ContentPack } from './contentPack';
import { MOOD_STORAGE_KEY } from './mood';
import { getReleaseNote } from './releaseNotes';

jest.mock('./aiBlurbs', () => ({
  fetchAiBlurbBundle: jest.fn().mockResolvedValue(null),
}));

const mockedFetchAiBlurbBundle = fetchAiBlurbBundle as jest.MockedFunction<
  typeof fetchAiBlurbBundle
>;

async function renderAppAt(
  date: Date,
  contentPack?: ContentPack,
  options: { waitForAi?: boolean } = {}
): Promise<void> {
  const { waitForAi = true } = options;

  render(<App initialDate={date} contentPack={contentPack} />);
  await waitFor(() =>
    expect(
      screen.queryByText(/Laddar namnsdag från öppet API/i)
    ).not.toBeInTheDocument()
  );

  if (waitForAi) {
    await waitFor(() =>
      expect(screen.queryByText(/Hämtar dagens text\./i)).not.toBeInTheDocument()
    );
  }
}

beforeEach(() => {
  window.localStorage.clear();
  mockedFetchAiBlurbBundle.mockReset();
  mockedFetchAiBlurbBundle.mockResolvedValue(null);

  jest.spyOn(global, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes('/api/blurbs')) {
      return {
        ok: true,
        status: 204,
        json: async () => ({}),
      } as Response;
    }

    if (url.includes('/2026/03/14')) {
      return {
        ok: true,
        json: async () => ({ dagar: [{ namnsdag: ['Matilda', 'Maud'] }] }),
      } as Response;
    }

    if (url.includes('/2026/06/19')) {
      return {
        ok: true,
        json: async () => ({ dagar: [{ namnsdag: ['Germund', 'Yvonne'] }] }),
      } as Response;
    }

    return {
      ok: true,
      json: async () => ({ dagar: [{ namnsdag: [] }] }),
    } as Response;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders ordinary public content for a regular Wednesday', async () => {
  await renderAppAt(new Date(2026, 6, 8));
  expect(screen.queryByRole('heading', { level: 2, name: /KÖTTONSDAG/i })).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: /En vanlig dag/i })
  ).toBeInTheDocument();
});

test('renders team-pack Wednesday content when the team pack is active', async () => {
  await renderAppAt(new Date(2026, 6, 8), 'team');
  expect(
    screen.getByRole('heading', { level: 2, name: /KÖTTONSDAG/i })
  ).toBeInTheDocument();
});

test('renders Fettisdag content on the actual Fettisdag date', async () => {
  await renderAppAt(new Date(2026, 1, 17));
  expect(
    screen.getByRole('heading', { level: 2, name: /FETTISDAG/i })
  ).toBeInTheDocument();
});

test('renders Kanelbullens dag ahead of the generic Saturday fallback', async () => {
  await renderAppAt(new Date(2026, 9, 4));
  expect(
    screen.getByRole('heading', { level: 2, name: /Kanelbullens dag bär upp nationen/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/Fler temadagar idag/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Internationella Tacodagen/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/^Kanelbullens dag$/i)).not.toBeInTheDocument();
});

test('renders Valborg as a fixed celebration date', async () => {
  await renderAppAt(new Date(2026, 3, 30));
  expect(
    screen.getByRole('heading', { level: 2, name: /Valborg, alltså vår med dåligt omdöme/i })
  ).toBeInTheDocument();
});

test('renders Nationaldagen ahead of the generic Saturday fallback', async () => {
  await renderAppAt(new Date(2026, 5, 6));
  expect(
    screen.getByRole('heading', { level: 2, name: /Nationaldagen får väl firas då/i })
  ).toBeInTheDocument();
});

test('renders Midsommarafton ahead of the generic Friday fallback', async () => {
  await renderAppAt(new Date(2026, 5, 19));
  expect(
    screen.getByRole('heading', { level: 2, name: /MIDSOMMARAFTON/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/MARMELADFREDAG/i)).not.toBeInTheDocument();
});

test('renders Surströmmingspremiär ahead of the generic Thursday fallback', async () => {
  await renderAppAt(new Date(2026, 7, 20));
  expect(
    screen.getByRole('heading', { level: 2, name: /SURSTRÖMMINGSPREMIÄR/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/FISKTORSDAG/i)).not.toBeInTheDocument();
});

test('renders Fisktorsdag using the cleaned non-branded image', async () => {
  await renderAppAt(new Date(2026, 2, 19), 'team');

  expect(
    screen.getByRole('heading', { level: 2, name: /Fisktorsdag/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Håller ihop civilisationen med dill och institutionell envishet\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Fisktorsdag/i)).toHaveAttribute(
    'src',
    '/fisktorsdag-fixed-composite.png'
  );
});

test('does not render Fettisdag content on a random Tuesday', async () => {
  await renderAppAt(new Date(2026, 2, 30));
  expect(screen.queryByText(/FETTISDAG/i)).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: /En vanlig dag/i })
  ).toBeInTheDocument();
});

test('renders a rerollable blurb on an ordinary weekday', async () => {
  const randomSpy = jest
    .spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99);

  await renderAppAt(new Date(2026, 1, 16));

  expect(
    screen.getByText(
      /Det är en vanlig arbetsdag\. Du får skapa din egen stämning, och det känns ju tveksamt\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ny ursäkt/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(
    screen.getByText(
      /Det här är administrationens egen lilla arbetsseger: en dag som inte stör, gläder eller ursäktar något alls\./i
    )
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});

test('renders a rerollable blurb on an ordinary weekend date', async () => {
  const randomSpy = jest
    .spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99);

  await renderAppAt(new Date(2026, 2, 28));

  expect(
    screen.getByText(
      /Det är helg, men inte på det minsta glittriga sättet\. Bara frihet med lätt städsmak i bakgrunden\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ny ursäkt/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(
    screen.getByText(
      /Helgens stora innehåll idag är att den pågår\. Man får tydligen vara tacksam för det\./i
    )
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});

test('renders Påskafton with an actual image', async () => {
  await renderAppAt(new Date(2026, 3, 4));

  expect(
    screen.getByRole('heading', { level: 2, name: /Påskafton/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Påskafton/i)).toHaveAttribute('src', '/images/paskafton.jpg');
});

test('renders Våffeldagen with an actual image', async () => {
  await renderAppAt(new Date(2026, 2, 25));

  expect(
    screen.getByRole('heading', { level: 2, name: /Våffeldagen har tagit över/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Våffeldagen har tagit över/i)).toHaveAttribute(
    'src',
    '/images/vaffeldagen.jpg'
  );
});

test('renders Valborg with an actual image', async () => {
  await renderAppAt(new Date(2026, 3, 30));

  expect(
    screen.getByRole('heading', { level: 2, name: /Valborg, alltså vår med dåligt omdöme/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Valborg, alltså vår med dåligt omdöme/i)).toHaveAttribute(
    'src',
    '/images/valborg.jpg'
  );
});

test('renders Julafton ahead of the generic Thursday fallback', async () => {
  await renderAppAt(new Date(2026, 11, 24));

  expect(
    screen.getByRole('heading', { level: 2, name: /Julafton/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Julafton/i)).toBeInTheDocument();
  expect(screen.queryByText(/FISKTORSDAG/i)).not.toBeInTheDocument();
});

test('renders Nyårsafton ahead of the generic Thursday fallback with an actual image', async () => {
  await renderAppAt(new Date(2026, 11, 31));

  expect(
    screen.getByRole('heading', { level: 2, name: /Nyårsafton/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Nyårsafton/i)).toHaveAttribute('src', '/images/nyarsafton.jpg');
  expect(screen.queryByText(/FISKTORSDAG/i)).not.toBeInTheDocument();
});

test('renders filtered temadagar for an otherwise ordinary date', async () => {
  const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

  await renderAppAt(new Date(2027, 2, 23));

  expect(
    screen.getByRole('heading', {
      level: 2,
      name: /Matlådans dag\.\s*Det får väl bära dagen då\./i,
    })
  ).toBeInTheDocument();
  expect(screen.getAllByRole('list').length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Nordens dag/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Världsmeteorologidagen/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Internationella barnreumatikerdagen/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Dagens temadagar/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Matlådans dag är i praktiken ett erkännande av kall disciplin i plastform\./i)
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});

test('renders namnsdag data from the open API lookup', async () => {
  await renderAppAt(new Date(2026, 2, 14));
  expect(screen.getByText(/Matilda och Maud/i)).toBeInTheDocument();
});

test('renders a subtle build stamp in the footer', async () => {
  await renderAppAt(new Date(2026, 2, 14));
  expect(screen.getByText(new RegExp(buildInfo.gitSha, 'i'))).toBeInTheDocument();
});

test('shows a simple current release note and opens the changelog history', async () => {
  await renderAppAt(new Date(2026, 2, 14));

  const currentRelease = getReleaseNote(buildInfo.version);
  expect(currentRelease).not.toBeNull();
  expect(screen.getByText(currentRelease!.shortSummary.sv)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Visa alla ändringar/i }));

  expect(
    screen.getByRole('heading', { level: 2, name: /Det här har ändrats i appen/i })
  ).toBeInTheDocument();
  expect(screen.getByText(currentRelease!.summary.sv)).toBeInTheDocument();
  expect(screen.getByText(/v0\.1\.12/i)).toBeInTheDocument();
});

test('renders public image credits when opening the credits dialog', async () => {
  await renderAppAt(new Date(2026, 2, 25));

  fireEvent.click(screen.getByRole('button', { name: /Bildkällor/i }));

  expect(
    screen.getByRole('heading', { level: 2, name: /Wikimedia Commons-credits/i })
  ).toBeInTheDocument();
  expect(screen.getAllByText(/Våffeldagen/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/CC BY-SA 4.0/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Commons-filsida/i).length).toBeGreaterThan(0);
});

test('renders an upcoming official holiday note when one lands later that week', async () => {
  await renderAppAt(new Date(2026, 3, 27));

  expect(screen.getByText(/Veckans helgdag/i)).toBeInTheDocument();
  expect(screen.getAllByText(/^Första maj$/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/4 dagar kvar/i)).toBeInTheDocument();
});

test('renders upcoming notable dates with major celebrations ahead of random filler', async () => {
  await renderAppAt(new Date(2026, 3, 27));

  expect(screen.getByText(/På gång/i)).toBeInTheDocument();
  expect(screen.getByText(/^Valborg$/i)).toBeInTheDocument();
  expect(screen.getAllByText(/^Första maj$/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Om 3 dagar/i).length).toBeGreaterThan(0);
});

test('allows collapsing the upcoming panel', async () => {
  await renderAppAt(new Date(2026, 3, 27));

  expect(screen.getByText(/^Valborg$/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /På gång/i }));

  expect(screen.queryByText(/^Valborg$/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /På gång/i }));

  expect(screen.getByText(/^Valborg$/i)).toBeInTheDocument();
});

test('allows collapsing the ordinary theme-day panel from its own heading', async () => {
  await renderAppAt(new Date(2027, 2, 23));

  expect(screen.getByText(/^Nordens dag$/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Dagens temadagar/i }));

  expect(screen.queryByText(/^Nordens dag$/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Dagens temadagar/i }));

  expect(screen.getByText(/^Nordens dag$/i)).toBeInTheDocument();
});

test('allows collapsing the extra theme-day panel from its own heading', async () => {
  await renderAppAt(new Date(2026, 9, 4));

  expect(screen.getAllByText(/Internationella Tacodagen/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: /Fler temadagar idag/i }));

  expect(screen.queryByText(/Internationella Tacodagen/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Fler temadagar idag/i }));

  expect(screen.getAllByText(/Internationella Tacodagen/i).length).toBeGreaterThan(0);
});

test('allows collapsing the world-day panel from its own heading', async () => {
  await renderAppAt(new Date(2026, 9, 4));

  expect(screen.getAllByText(/Lesotho/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: /Också idag/i }));

  expect(screen.queryByText(/Lesotho/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Också idag/i }));

  expect(screen.getAllByText(/Lesotho/i).length).toBeGreaterThan(0);
});

test('renders bokrean as a seasonal sidebar note during the sale window', async () => {
  await renderAppAt(new Date(2026, 1, 24));

  expect(screen.getAllByText(/Säsongen pågår/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/^Bokrean$/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /Papper, impulsköp och den gamla svenska drömmen om att man plötsligt ska bli en människa som läser mer\./i
    )
  ).toBeInTheDocument();
});

test('renders kräftskivesäsong as a seasonal sidebar note during late summer', async () => {
  await renderAppAt(new Date(2026, 7, 20));

  expect(screen.getAllByText(/Säsongen pågår/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/^Kräftskivesäsong$/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /Pappershattar, dill och ett kollektivt beslut att små kräftor tydligen är en fullgod plan för sensommaren\./i
    )
  ).toBeInTheDocument();
});

test('rerolls the excuse when clicking Ny ursäkt', async () => {
  const randomSpy = jest
    .spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99);

  await renderAppAt(new Date(2026, 2, 13), 'team');

  expect(
    screen.getByText(/Veckan är över\. Nu återstår bara att låtsas vara klar med allt\./i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(
    screen.getByText(
      /Marmeladfredag är när helgen syns i dörren och samvetet försöker hålla ihop med hjälp av socker\./i
    )
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});

test('steps between days from the center navigation buttons', async () => {
  await renderAppAt(new Date(2026, 2, 25));

  expect(
    screen.getByRole('heading', { level: 2, name: /Våffeldagen har tagit över/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Föregående dag/i }));

  await waitFor(() =>
    expect(screen.getByDisplayValue('2026-03-24')).toBeInTheDocument()
  );
  expect(
    screen.queryByRole('heading', { level: 2, name: /Våffeldagen har tagit över/i })
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Nästa dag/i }));

  await waitFor(() =>
    expect(screen.getByDisplayValue('2026-03-25')).toBeInTheDocument()
  );
  expect(
    screen.getByRole('heading', { level: 2, name: /Våffeldagen har tagit över/i })
  ).toBeInTheDocument();
});

test('hides fallback blurbs until the ai request resolves', async () => {
  let resolveBundle!: (value: {
    source: 'cache';
    titleEndings: string[];
    cardNotes: string[];
    blurbs: string[];
  }) => void;

  mockedFetchAiBlurbBundle.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveBundle = resolve;
      })
  );

  await renderAppAt(new Date(2026, 1, 16), undefined, { waitForAi: false });

  expect(screen.getByText(/Hämtar dagens text\./i)).toBeInTheDocument();
  expect(
    screen.queryByText(
      /Det är en vanlig arbetsdag\. Du får skapa din egen stämning, och det känns ju tveksamt\./i
    )
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Ny ursäkt/i })).not.toBeInTheDocument();

  resolveBundle({
    source: 'cache',
    titleEndings: [],
    cardNotes: [],
    blurbs: ['AI-cachead text som faktiskt hör till datumet.'],
  });

  await waitFor(() =>
    expect(screen.getByText(/AI-cachead text som faktiskt hör till datumet\./i)).toBeInTheDocument()
  );
  expect(screen.queryByText(/Hämtar dagens text\./i)).not.toBeInTheDocument();
});

test('hides the previous ai blurb while a new date request is loading', async () => {
  let resolveSecondBundle!: (value: {
    source: 'cache';
    titleEndings: string[];
    cardNotes: string[];
    blurbs: string[];
  }) => void;

  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce({
      source: 'cache',
      titleEndings: [],
      cardNotes: [],
      blurbs: ['Första rätta texten.'],
    })
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSecondBundle = resolve;
        })
    );

  await renderAppAt(new Date(2026, 1, 16));

  expect(screen.getByText(/Första rätta texten\./i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Nästa dag/i }));

  expect(screen.getByText(/Hämtar dagens text\./i)).toBeInTheDocument();
  expect(screen.queryByText(/Första rätta texten\./i)).not.toBeInTheDocument();

  resolveSecondBundle({
    source: 'cache',
    titleEndings: [],
    cardNotes: [],
    blurbs: ['Andra rätta texten.'],
  });

  await waitFor(() =>
    expect(screen.getByText(/Andra rätta texten\./i)).toBeInTheDocument()
  );
});

test('persists the selected mood and exposes it on the app root', async () => {
  await renderAppAt(new Date(2026, 2, 14));

  fireEvent.change(screen.getByLabelText(/Ton/i), {
    target: { value: 'chaotic' },
  });

  await waitFor(() =>
    expect(window.localStorage.getItem(MOOD_STORAGE_KEY)).toBe('chaotic')
  );
  expect(document.querySelector('.App')).toHaveAttribute('data-mood', 'chaotic');
});

test('sends the selected mood in ai blurb requests', async () => {
  await renderAppAt(new Date(2026, 2, 14));

  await waitFor(() => expect(mockedFetchAiBlurbBundle).toHaveBeenCalled());
  mockedFetchAiBlurbBundle.mockClear();

  fireEvent.change(screen.getByLabelText(/Ton/i), {
    target: { value: 'warm' },
  });

  await waitFor(() =>
    expect(mockedFetchAiBlurbBundle).toHaveBeenLastCalledWith(
      expect.objectContaining({ mood: 'warm' }),
      expect.any(AbortSignal)
    )
  );
});

test('only asks for another ai variant when reroll is clicked', async () => {
  mockedFetchAiBlurbBundle
    .mockResolvedValueOnce({
      source: 'cache',
      titleEndings: [],
      cardNotes: [],
      blurbs: ['Första ai-texten.'],
    })
    .mockResolvedValueOnce({
      source: 'azure-openai',
      titleEndings: [],
      cardNotes: [],
      blurbs: ['Ny ai-text efter reroll.'],
    });

  await renderAppAt(new Date(2026, 2, 14));

  mockedFetchAiBlurbBundle.mockClear();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  await waitFor(() =>
    expect(mockedFetchAiBlurbBundle).toHaveBeenLastCalledWith(
      expect.objectContaining({ requestMode: 'reroll' }),
      undefined
    )
  );
  await waitFor(() =>
    expect(screen.getByText(/Ny ai-text efter reroll\./i)).toBeInTheDocument()
  );
});
