import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../helpers/ApiHelper';

test.describe('Products - API', () => {

  test('GET all products returns 200 and non-empty list', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllProducts();

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('Each product has required fields', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.getAllProducts();

    for (const product of body.products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
    }
  });

  test('Search for Tshirt returns matching products', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.searchProduct('Tshirt');

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('Search with GET method returns 405', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.searchProductInvalidMethod();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('request method is not supported');
  });

  test('GET all brands returns 200 and non-empty list', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllBrands();

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
  });

});
