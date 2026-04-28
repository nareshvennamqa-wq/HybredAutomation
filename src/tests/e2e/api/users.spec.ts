import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../helpers/ApiHelper';
import { generateUser } from '../../../utils/testData';

test.describe('User CRUD - API', () => {

  test('Create a new account and verify it exists', async ({ request }) => {
    const api = new ApiHelper(request);
    const user = generateUser();

    const { body: createBody } = await api.createAccount({
      name: user.name,
      email: user.email,
      password: user.password,
      firstname: 'Test',
      lastname: 'User',
      address1: 'Hyderabad',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      zipcode: '500001',
      mobile_number: '9999999999',
    });

    expect(createBody.responseCode).toBe(201);
    expect(createBody.message).toContain('User created');

    // Verify user exists via GET
    const { body: getBody } = await api.getUserByEmail(user.email);
    expect(getBody.responseCode).toBe(200);
    expect(getBody.user.email).toBe(user.email);

    // Cleanup
    await api.deleteAccount(user.email, user.password);
  });

  test('Delete an existing account', async ({ request }) => {
    const api = new ApiHelper(request);
    const user = generateUser();

    // Create first
    await api.createAccount({
      name: user.name,
      email: user.email,
      password: user.password,
      firstname: 'Test',
      lastname: 'User',
      address1: 'Hyderabad',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      zipcode: '500001',
      mobile_number: '9999999999',
    });

    // Then delete
    const { body } = await api.deleteAccount(user.email, user.password);
    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('Account deleted');
  });

  test('Get user detail by valid email', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.getUserByEmail(process.env.LOGIN_EMAIL!);

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.user).toHaveProperty('email', process.env.LOGIN_EMAIL);
    expect(body.user).toHaveProperty('name');
  });

  test('Get user detail by invalid email returns 404', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.getUserByEmail('ghost@notreal.com');

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('Account not found');
  });

});
