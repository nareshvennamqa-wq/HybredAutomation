import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate('/login');
    await expect(this.page.locator('input[data-qa="login-email"]')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.fill('input[data-qa="login-email"]', email);
    await this.page.fill('input[data-qa="login-password"]', password);
    await this.page.click('button[data-qa="login-button"]');
  }

  async verifyLoginSuccess() {
    await expect(
      this.page.locator('a').filter({ hasText: 'Logged in as' })
    ).toBeVisible();
  }

  async verifyLoginError() {
    await expect(
      this.page.locator('form').filter({ hasText: 'Login' }).getByText('Your email or password is incorrect!')
    ).toBeVisible();
  }

  async verifyEmailFieldFocused() {
    const emailField = this.page.locator('input[data-qa="login-email"]');
    await expect(emailField).toBeVisible();
    expect(await emailField.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBeTruthy();
  }

  async verifyPasswordFieldFocused() {
    const passwordField = this.page.locator('input[data-qa="login-password"]');
    await expect(passwordField).toBeVisible();
    expect(await passwordField.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBeTruthy();
  }
}
