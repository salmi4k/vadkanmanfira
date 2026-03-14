import { expect, test, type Page } from '@playwright/test';

async function preparePage(page: Page) {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });

  await page.route('https://sholiday.faboul.se/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ dagar: [{ namnsdag: ['Matilda', 'Maud'] }] }),
    });
  });
}

async function openDate(page: Page, dateLabel: string) {
  await page.goto('/');
  await page.locator('#date-picker').fill(dateLabel);
  await page.waitForTimeout(150);
}

test('ordinary weekday layout stays intact', async ({ page }) => {
  await preparePage(page);
  await openDate(page, '2026-03-16');

  await expect(page.locator('.app-grid')).toHaveScreenshot('ordinary-weekday.png');
});

test('crowded themeday layout stays intact', async ({ page }) => {
  await preparePage(page);
  await openDate(page, '2027-03-23');

  await expect(page.locator('.app-grid')).toHaveScreenshot('crowded-themeday.png');
});

test('marmeladfredag layout stays intact', async ({ page }) => {
  await preparePage(page);
  await openDate(page, '2026-03-13');

  await expect(page.locator('.app-grid')).toHaveScreenshot('marmeladfredag.png');
});
