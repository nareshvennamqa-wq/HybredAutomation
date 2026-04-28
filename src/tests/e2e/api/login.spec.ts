import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../helpers/ApiHelper';

test.describe('Login - API', () => {

  test('Valid credentials return 200 and user exists message', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.verifyLogin(
      process.env.LOGIN_EMAIL!,
      process.env.LOGIN_PASSWORD!
    );

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('User exists');
  });

  test('Invalid email returns 404', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.verifyLogin(
      'nobody@fake.com',
      process.env.LOGIN_PASSWORD!
    );

    expect(status).toBe(200); // API always returns HTTP 200
    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  test('Wrong password returns 404', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.verifyLogin(
      process.env.LOGIN_EMAIL!,
      'WrongPassword999!'
    );

    expect(status).toBe(200);
    expect(body.responseCode).toBe(404);
  });

  test('DELETE method on verifyLogin returns 405', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.verifyLoginInvalidMethod();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('request method is not supported');
  });

});
