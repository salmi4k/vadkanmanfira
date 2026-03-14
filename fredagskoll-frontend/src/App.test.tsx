import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

async function renderAppAt(date: Date): Promise<void> {
  render(<App initialDate={date} />);
  await waitFor(() =>
    expect(
      screen.queryByText(/Laddar namnsdag från öppet API/i)
    ).not.toBeInTheDocument()
  );
}

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input);

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

test('renders Wednesday content for an ordinary Wednesday', async () => {
  await renderAppAt(new Date(2026, 0, 14));
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
  expect(screen.getByText(/KANELBULLENS DAG/i)).toBeInTheDocument();
});

test('renders Valborg as a fixed celebration date', async () => {
  await renderAppAt(new Date(2026, 3, 30));
  expect(screen.getByText(/VALBORG/i)).toBeInTheDocument();
});

test('renders Nationaldagen ahead of the generic Saturday fallback', async () => {
  await renderAppAt(new Date(2026, 5, 6));
  expect(screen.getByText(/NATIONALDAGEN/i)).toBeInTheDocument();
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

test('does not render Fettisdag content on a random Tuesday', async () => {
  await renderAppAt(new Date(2026, 1, 24));
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

  await renderAppAt(new Date(2026, 2, 16));

  expect(
    screen.getByText(
      /Det är en vanlig arbetsdag\. Du får skapa din egen stämning, och det känns ju tveksamt\./i
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ny ursäkt/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(
    screen.getByText(
      /Allt tyder på att du får ta dig igenom den här dagen utan hjälp av någon som helst högtidsenergi\./i
    )
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});

test('renders namnsdag data from the open API lookup', async () => {
  await renderAppAt(new Date(2026, 2, 14));
  expect(screen.getByText(/Matilda och Maud/i)).toBeInTheDocument();
});

test('rerolls the excuse when clicking Ny ursäkt', async () => {
  const randomSpy = jest
    .spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99);

  await renderAppAt(new Date(2026, 2, 13));

  expect(
    screen.getByText(/Veckan är över\. Nu återstår bara att låtsas vara klar med allt\./i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Ny ursäkt/i }));

  expect(
    screen.getByText(
      /Nu gäller det att avrunda veckan med samma energi som en sliten men välfungerande efterrätt\./i
    )
  ).toBeInTheDocument();

  randomSpy.mockRestore();
});
