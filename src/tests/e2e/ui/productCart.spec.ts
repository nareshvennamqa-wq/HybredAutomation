import { test } from '@playwright/test';
import { ProductPage } from '../../../pages/ProductPage';
import { CartPage } from '../../../pages/CartPage';

test.describe('Product & Cart - UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('Search and add a product to cart', async ({ page }) => {
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const productName = 'Men Tshirt';

    await product.goToProducts();
    await product.searchProduct(productName);
    await product.addFirstProductToCart(productName);
    await product.goToCart();
    await cart.verifyProductInCart();
  });

  test('Cart shows correct item after adding product', async ({ page }) => {
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const productName = 'Men Tshirt';

    await product.goToProducts();
    await product.searchProduct(productName);
    await product.addFirstProductToCart(productName);
    await product.goToCart();
    await cart.verifyCartItemCount(1);
  });

  test('Remove item from cart leaves cart empty', async ({ page }) => {
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const productName = 'Men Tshirt';

    await product.goToProducts();
    await product.searchProduct(productName);
    await product.addFirstProductToCart(productName);
    await product.goToCart();
    await cart.removeFirstItem();
    await cart.verifyCartIsEmpty();
  });

});
