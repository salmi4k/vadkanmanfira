import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi, type MockedFunction } from 'vitest';
import App from './App';
import { ContentPack } from './contentPack';
import {
  getOrdinaryThemeDayCardNotes,
  getOrdinaryThemeDayTitleEndings,
} from './editorialText';
import { useAiContent } from './features/ai/useAiContent';
import { useNameDays } from './features/name-days/useNameDays';
import { getThemeDaysForDate } from './features/theme-days/temadagar';

vi.mock('./features/ai/useAiContent', () => ({
  useAiContent: vi.fn(),
}));

vi.mock('./features/name-days/useNameDays', () => ({
  useNameDays: vi.fn(),
}));

const mockedUseAiContent = useAiContent as MockedFunction<typeof useAiContent>;
const mockedUseNameDays = useNameDays as MockedFunction<typeof useNameDays>;

async function renderAppAt(date: Date, contentPack?: ContentPack): Promise<void> {
  render(<App initialDate={date} contentPack={contentPack} />);
  await waitFor(() =>
    expect(screen.queryByText(/Hämtar dagens text\./i)).not.toBeInTheDocument()
  );
}

function buildMockAiContent(
  overrides: Partial<ReturnType<typeof useAiContent>> = {}
): ReturnType<typeof useAiContent> {
  return {
    blurb: 'Standardtext.',
    currentBlurbs: ['Standardtext.'],
    handleReroll: vi.fn(),
    isAiBundleLoading: false,
    isAiRerolling: false,
    themeDayCardNote: 'Standardnotis.',
    themeDayTitleEnding: 'Det får väl bära dagen då.',
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
  mockedUseAiContent.mockReset();
  mockedUseNameDays.mockReset();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });

  mockedUseNameDays.mockImplementation((dateLabel: string) => {
    if (dateLabel === '2026-03-14') {
      return { nameDays: ['Matilda', 'Maud'], nameDayState: 'ready' };
    }

    if (dateLabel === '2026-06-19') {
      return { nameDays: ['Germund', 'Yvonne'], nameDayState: 'ready' };
    }

    return { nameDays: [], nameDayState: 'ready' };
  });

  mockedUseAiContent.mockImplementation(
    ({ celebration, ordinaryBlurb, locale, mood, themeDayBlurbs }) => {
      const currentBlurbs =
        celebration?.blurbs ?? themeDayBlurbs ?? (ordinaryBlurb ? [ordinaryBlurb] : null);

      return {
        ...buildMockAiContent({
          blurb: currentBlurbs?.[0] ?? ordinaryBlurb,
          currentBlurbs,
          themeDayCardNote: getOrdinaryThemeDayCardNotes(locale, mood)[0],
          themeDayTitleEnding: getOrdinaryThemeDayTitleEndings(locale, mood)[0],
        }),
      };
    }
  );
});

afterEach(() => {
  vi.restoreAllMocks();
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
    screen.getByRole('heading', { level: 2, name: /Nationen hålls ihop av grädde/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Överraska mig/i })).toBeInTheDocument();
  expect(screen.getByText(/Semlan leder, resten av dagen får försöka hänga med\./i)).toBeInTheDocument();
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
    screen.getByRole('heading', { level: 2, name: /Valborg\./i })
  ).toBeInTheDocument();
});

test('renders Nationaldagen ahead of the generic Saturday fallback', async () => {
  await renderAppAt(new Date(2026, 5, 6));
  expect(
    screen.getByRole('heading', { level: 2, name: /Nationaldagen\./i })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Dela dagen/i })).toBeInTheDocument();
});

test('renders Midsommarafton ahead of the generic Friday fallback', async () => {
  await renderAppAt(new Date(2026, 5, 19));
  expect(
    screen.getByRole('heading', { level: 2, name: /Landet är mentalt otillgängligt/i })
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
  expect(
    screen.queryByRole('heading', { level: 2, name: /Nationen hålls ihop av grädde/i })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: /En vanlig dag/i })
  ).toBeInTheDocument();
});

test('renders a rerollable blurb on an ordinary weekday', async () => {
  const handleReroll = vi.fn();
  mockedUseAiContent.mockImplementationOnce(() =>
    buildMockAiContent({
      blurb:
        'Det är en vanlig arbetsdag. Du får skapa din egen stämning, och det känns ju tveksamt.',
      currentBlurbs: [
        'Det är en vanlig arbetsdag. Du får skapa din egen stämning, och det känns ju tveksamt.',
      ],
      handleReroll,
    })
  );

  await renderAppAt(new Date(2026, 1, 16));

  expect(
    screen.getByText(
      /Det är en vanlig arbetsdag\. Du får skapa din egen stämning, och det känns ju tveksamt\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ny ursäkt/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(handleReroll).toHaveBeenCalledTimes(1);
});

test('renders a rerollable blurb on an ordinary weekend date', async () => {
  const handleReroll = vi.fn();
  mockedUseAiContent.mockImplementationOnce(() =>
    buildMockAiContent({
      blurb:
        'Det är helg, men inte på det minsta glittriga sättet. Bara frihet med lätt städsmak i bakgrunden.',
      currentBlurbs: [
        'Det är helg, men inte på det minsta glittriga sättet. Bara frihet med lätt städsmak i bakgrunden.',
      ],
      handleReroll,
    })
  );

  await renderAppAt(new Date(2026, 2, 28));

  expect(
    screen.getByText(
      /Det är helg, men inte på det minsta glittriga sättet\. Bara frihet med lätt städsmak i bakgrunden\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ny ursäkt/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(handleReroll).toHaveBeenCalledTimes(1);
});

test('renders Påskafton with an actual image', async () => {
  await renderAppAt(new Date(2026, 3, 4));

  expect(
    screen.getByRole('heading', { level: 2, name: /Påskafton/i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Påskafton/i)).toHaveAttribute('src', '/images/paskafton.jpg');
});

test('renders Skärtorsdag ahead of the generic Thursday fallback', async () => {
  await renderAppAt(new Date(2026, 3, 2));

  expect(
    screen.getByRole('heading', { level: 2, name: /Skärtorsdag\./i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Skärtorsdag/i)).toHaveAttribute('src', '/images/paskafton.jpg');
  expect(screen.queryByText(/FISKTORSDAG/i)).not.toBeInTheDocument();
});

test('renders Långfredag as its own Easter holiday instead of ordinary Friday tone', async () => {
  await renderAppAt(new Date(2026, 3, 3));

  expect(
    screen.getByRole('heading', { level: 2, name: /Långfredag\./i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Långfredag/i)).toHaveAttribute('src', '/images/paskafton.jpg');
  expect(screen.queryByText(/MARMELADFREDAG/i)).not.toBeInTheDocument();
});

test('renders Påskdagen as its own Easter holiday instead of ordinary Sunday copy', async () => {
  await renderAppAt(new Date(2026, 3, 5));

  expect(
    screen.getByRole('heading', { level: 2, name: /Påskdagen\./i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Påskdagen/i)).toHaveAttribute('src', '/images/paskafton.jpg');
  expect(screen.queryByText(/En vanlig dag/i)).not.toBeInTheDocument();
});

test('renders Annandag påsk as its own Easter holiday instead of ordinary Monday copy', async () => {
  await renderAppAt(new Date(2026, 3, 6));

  expect(
    screen.getByRole('heading', { level: 2, name: /Annandag påsk\./i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Annandag påsk/i)).toHaveAttribute('src', '/images/paskafton.jpg');
  expect(screen.queryByText(/En vanlig dag/i)).not.toBeInTheDocument();
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
    screen.getByRole('heading', { level: 2, name: /Valborg\./i })
  ).toBeInTheDocument();
  expect(screen.getByAltText(/Valborg\. Nu räcker april och alla går ut ändå/i)).toHaveAttribute(
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
  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  const leadThemeDay = getThemeDaysForDate(new Date(2027, 2, 23))[0];

  await renderAppAt(new Date(2027, 2, 23));

  expect(
    screen.getByRole('heading', {
      level: 2,
      name: new RegExp(leadThemeDay, 'i'),
    })
  ).toBeInTheDocument();
  expect(screen.getAllByRole('list').length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Nordens dag/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Världsmeteorologidagen/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Internationella barnreumatikerdagen/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Dagens temadagar/i)).toBeInTheDocument();
  expect(screen.getAllByText(new RegExp(leadThemeDay, 'i')).length).toBeGreaterThan(0);

  randomSpy.mockRestore();
});

test('picks the more meaningful March 21 theme day instead of blindly using source order', async () => {
  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  const leadThemeDay = getThemeDaysForDate(new Date(2026, 2, 21))[0];

  await renderAppAt(new Date(2026, 2, 21));

  expect(
    screen.getByRole('heading', {
      level: 2,
      name: new RegExp(leadThemeDay, 'i'),
    })
  ).toBeInTheDocument();
  expect(leadThemeDay).toBe('Rocka sockorna-dagen');
  expect(screen.getAllByText(/Internationella dagen för Nowruz/i).length).toBeGreaterThan(0);

  randomSpy.mockRestore();
});

test('renders namnsdag data from the open API lookup', async () => {
  await renderAppAt(new Date(2026, 2, 14));
  expect(screen.getByText(/Matilda och Maud/i)).toBeInTheDocument();
});

test('renders a restrained footer with image credits access', async () => {
  await renderAppAt(new Date(2026, 2, 14));
  expect(screen.getByText(/De nedladdade Commons-bilderna är publikt krediterade här/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Bildkällor/i })).toBeInTheDocument();
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

  expect(screen.getByRole('button', { name: /På gång/i })).toBeInTheDocument();
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
  const handleReroll = vi.fn();
  mockedUseAiContent.mockImplementationOnce(() =>
    buildMockAiContent({
      blurb: 'Veckan är över. Nu återstår bara att låtsas vara klar med allt.',
      currentBlurbs: ['Veckan är över. Nu återstår bara att låtsas vara klar med allt.'],
      handleReroll,
    })
  );

  await renderAppAt(new Date(2026, 2, 13), 'team');

  expect(
    screen.getByText(/Veckan är över\. Nu återstår bara att låtsas vara klar med allt\./i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(handleReroll).toHaveBeenCalledTimes(1);
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
  mockedUseAiContent.mockImplementationOnce(() =>
    buildMockAiContent({
      blurb: 'Det här ska inte synas ännu.',
      currentBlurbs: null,
      isAiBundleLoading: true,
    })
  );

  render(<App initialDate={new Date(2026, 1, 16)} />);

  expect(screen.getByText(/Hämtar dagens text\./i)).toBeInTheDocument();
  expect(
    screen.queryByText(
      /Det här ska inte synas ännu\./i
    )
  ).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Ny ursäkt/i })).not.toBeInTheDocument();
});

test('hides the previous ai blurb while a new date request is loading', async () => {
  mockedUseAiContent.mockImplementation(({ selectedDate }) =>
    selectedDate === '2026-02-16'
      ? buildMockAiContent({
          blurb: 'Första rätta texten.',
          currentBlurbs: ['Första rätta texten.'],
        })
      : buildMockAiContent({
          blurb: 'Andra rätta texten.',
          currentBlurbs: null,
          isAiBundleLoading: true,
        })
  );

  await renderAppAt(new Date(2026, 1, 16));

  expect(screen.getByText(/Första rätta texten\./i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Nästa dag/i }));

  expect(screen.getByText(/Hämtar dagens text\./i)).toBeInTheDocument();
  expect(screen.queryByText(/Första rätta texten\./i)).not.toBeInTheDocument();
});

test('sends the opinionated warm mood in ai blurb requests', async () => {
  await renderAppAt(new Date(2026, 2, 14));

  await waitFor(() =>
    expect(mockedUseAiContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        aiRequest: expect.objectContaining({ mood: 'warm' }),
        mood: 'warm',
      })
    )
  );
});

test('only asks for another ai variant when reroll is clicked', async () => {
  const handleReroll = vi.fn();
  mockedUseAiContent.mockImplementationOnce(() =>
    buildMockAiContent({
      blurb: 'Första ai-texten.',
      currentBlurbs: ['Första ai-texten.'],
      handleReroll,
    })
  );

  await renderAppAt(new Date(2026, 2, 14));

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(handleReroll).toHaveBeenCalledTimes(1);
});

test('scrolls back to the main card after confirming a mobile date change', async () => {
  const matchMediaMock = vi.fn().mockReturnValue({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  const scrollIntoViewMock = vi.fn();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: scrollIntoViewMock,
  });

  await renderAppAt(new Date(2026, 2, 14));

  vi.useFakeTimers();

  try {
    fireEvent.change(screen.getByLabelText(/Välj datum/i), {
      target: { value: '2026-03-15' },
    });

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    fireEvent.blur(document.getElementById('date-picker') as HTMLInputElement);

    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(scrollIntoViewMock).toHaveBeenCalled();
  } finally {
    vi.useRealTimers();
  }
});

test('does not repeat Sveriges nationaldag in the extra theme-day list', async () => {
  await renderAppAt(new Date(2026, 5, 6));

  expect(screen.queryByText(/^Sveriges nationaldag$/i)).not.toBeInTheDocument();
});

test('keeps Arbetarrorelsens dag visible on Forsta maj', async () => {
  await renderAppAt(new Date(2026, 4, 1));

  expect(screen.getAllByText(/^Arbetarrörelsens dag$/i).length).toBeGreaterThan(0);
});

