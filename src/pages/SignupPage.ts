import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

type AccountDetails = {
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  mobileNumber?: string;
};

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate('/login');
    await expect(this.page.locator('input[data-qa="signup-name"]')).toBeVisible();
  }

  async enterNameAndEmail(name: string, email: string) {
    await this.page.fill('input[data-qa="signup-name"]', name);
    await this.page.fill('input[data-qa="signup-email"]', email);
    await this.page.click('button[data-qa="signup-button"]');
  }

  async fillAccountDetails(details: AccountDetails = {}) {
    await this.page.click('#id_gender1');
    await this.page.fill('#password', details.password ?? 'Test@123');

    await this.page.selectOption('#days', '10');
    await this.page.selectOption('#months', '5');
    await this.page.selectOption('#years', '1995');

    await this.page.fill('#first_name', details.firstName ?? 'Naresh');
    await this.page.fill('#last_name', details.lastName ?? 'Reddy');
    await this.page.fill('#address1', details.address ?? 'Hyderabad');

    await this.page.selectOption('#country', 'India');
    await this.page.fill('#state', details.state ?? 'Telangana');
    await this.page.fill('#city', details.city ?? 'Hyderabad');
    await this.page.fill('#zipcode', details.zipcode ?? '500001');
    await this.page.fill('#mobile_number', details.mobileNumber ?? '9999999999');

    await this.page.click('button[data-qa="create-account"]');
  }

  async verifyAccountCreated() {
    await expect(this.page.getByText('Account Created!')).toBeVisible();
  }

  async verifyEmailAlreadyExists() {
    await expect(this.page.getByText('Email Address already exist!')).toBeVisible();
  }
}
