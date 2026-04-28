import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToProducts() {
    await super.navigate('/products');
    await expect(this.page.locator('#search_product')).toBeVisible();
  }

  async searchProduct(product: string) {
    await expect(this.page.locator('#search_product')).toBeVisible();
    await this.page.fill('#search_product', product);
    await this.page.click('#submit_search');
    await expect(this.page.locator('.product-image-wrapper').filter({ hasText: product }).first()).toBeVisible({ timeout: 30000 });
  }

  async addFirstProductToCart(product: string) {
    const productCard = this.page.locator('.product-image-wrapper').filter({ hasText: product }).first();
    const addToCartButton = productCard.locator('.productinfo .add-to-cart').first();

    await productCard.scrollIntoViewIfNeeded();
    await expect(addToCartButton).toBeVisible();

    const addToCartResponse = this.page
      .waitForResponse(
        response => response.url().includes('/add_to_cart/') && response.ok(),
        { timeout: 15000 }
      )
      .catch(() => null);

    try {
      await addToCartButton.click();
    } catch {
      await addToCartButton.evaluate((element: HTMLElement) => element.click());
    }

    await addToCartResponse;
  }

  async goToCart() {
    const viewCartLink = this.page.getByRole('link', { name: 'View Cart' });

    if (await viewCartLink.isVisible()) {
      await viewCartLink.click();
      return;
    }

    await this.page.locator('a[href="/view_cart"]').first().click();
  }
}
