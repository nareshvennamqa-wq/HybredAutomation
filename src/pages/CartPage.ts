import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async verifyProductInCart() {
    await expect(this.page.locator('text=Shopping Cart')).toBeVisible();
    await expect(this.page.locator('tr[id^="product-"]')).toHaveCount(1);
    await expect(this.page.locator('.cart_description')).toBeVisible();
  }

  async verifyCartItemCount(expectedCount: number) {
    await expect(this.page.locator('tr[id^="product-"]')).toHaveCount(expectedCount);
  }

  async removeFirstItem() {
    await this.page.locator('.cart_quantity_delete').first().click();
  }

  async verifyCartIsEmpty() {
    await expect(this.page.getByText('Cart is empty! Click here to buy products.')).toBeVisible();
  }
}
