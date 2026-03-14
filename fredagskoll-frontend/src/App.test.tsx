import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      isFriday: false,
      isTuesday: false,
      isWednesday: true,
      isThursday: false,
    }),
  }) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders Wednesday content', async () => {
  render(<App />);
  expect(await screen.findByText(/KÖTTONSDAG/i)).toBeInTheDocument();
});
