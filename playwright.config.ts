import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
  quiet: true,
});

function parseBoolean(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  return undefined;
}

const headlessOverride = parseBoolean(process.env.HEADLESS);

export default defineConfig({
  testDir: './src/tests/e2e',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['html'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
    headless: headlessOverride ?? !!process.env.CI,
    trace: 'on-first-retry',
    navigationTimeout: 45000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: /.*\.setup\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
