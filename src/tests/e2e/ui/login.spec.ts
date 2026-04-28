import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { generateWrongPassword } from '../../../utils/testData';

test.describe('Login - UI', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();
  });

  test('Login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LOGIN_EMAIL!, process.env.LOGIN_PASSWORD!);
    await login.verifyLoginSuccess();
  });

  test('Login with invalid email shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('nobody@fake.com', process.env.LOGIN_PASSWORD!);
    await login.verifyLoginError();
  });

  test('Login with wrong password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LOGIN_EMAIL!, generateWrongPassword());
    await login.verifyLoginError();
  });

  test('Login with both invalid email and wrong password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('nobody@nowhere.com', 'Totally$Wrong99');
    await login.verifyLoginError();
  });

  test('Login with empty email is blocked by browser validation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('', process.env.LOGIN_PASSWORD!);
    await login.verifyEmailFieldFocused();
  });

  test('Login with empty password is blocked by browser validation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LOGIN_EMAIL!, '');
    await login.verifyPasswordFieldFocused();
  });

});
