
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

test.describe('AI Generated Login Tests', () => {

  test('Login with valid credentials succeeds', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      process.env.LOGIN_EMAIL!,
      process.env.LOGIN_PASSWORD!
    );

    await login.verifyLoginSuccess();
  });

  test('Login with invalid email shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      'nobody@fake.com',
      process.env.LOGIN_PASSWORD!
    );

    await login.verifyLoginError();
  });

  test('Login with wrong password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      process.env.LOGIN_EMAIL!,
      'Totally$Wrong99'
    );

    await login.verifyLoginError();
  });

  test('Login with empty email is blocked', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      '',
      process.env.LOGIN_PASSWORD!
    );

    await login.verifyEmailFieldFocused();
  });

  test('Login with empty password is blocked', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      '',
      ''
    );

    await login.verifyPasswordFieldFocused();
  });
});