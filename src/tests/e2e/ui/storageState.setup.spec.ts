import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';

const authFile = path.resolve(__dirname, '../.auth/user.json');

setup('authenticate via API and save storage state', async ({ browser, request }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginPageResponse = await request.get('/login');
  expect(loginPageResponse.ok()).toBeTruthy();

  const loginPageHtml = await loginPageResponse.text();
  const csrfTokenMatch = loginPageHtml.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/);
  const csrfToken = csrfTokenMatch?.[1];

  expect(csrfToken, 'Expected CSRF token on the login page').toBeTruthy();

  const response = await request.post('/login', {
    failOnStatusCode: false,
    form: {
      csrfmiddlewaretoken: csrfToken!,
      email: process.env.LOGIN_EMAIL ?? '',
      password: process.env.LOGIN_PASSWORD ?? '',
    },
    headers: {
      referer: `${process.env.BASE_URL ?? 'https://automationexercise.com'}/login`,
    },
  });

  expect([200, 302]).toContain(response.status());

  await request.storageState({ path: authFile });

  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a').filter({ hasText: 'Logged in as' })).toBeVisible();
  await context.close();
});
