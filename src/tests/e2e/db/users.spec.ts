import { test, expect } from '@playwright/test';
import { DbHelper } from '../../../helpers/dbHelper';

test.describe('Users - DB', () => {

  const db = new DbHelper();

  test('Registered user exists in DB', () => {
    const user = db.getUserByEmail(process.env.LOGIN_EMAIL!);
    expect(user).toBeDefined();
  });

  test('Registered user has active status', () => {
    expect(db.isUserActive(process.env.LOGIN_EMAIL!)).toBe(true);
  });

  test('Valid credentials pass DB check', () => {
    expect(
      db.isValidCredentials(process.env.LOGIN_EMAIL!, process.env.LOGIN_PASSWORD!)
    ).toBe(true);
  });

  test('Wrong password fails DB credential check', () => {
    expect(
      db.isValidCredentials(process.env.LOGIN_EMAIL!, 'WrongPassword!')
    ).toBe(false);
  });

  test('Unknown email returns undefined from DB', () => {
    const user = db.getUserByEmail('ghost@notreal.com');
    expect(user).toBeUndefined();
  });

  test('userExists returns false for unknown email', () => {
    expect(db.userExists('nobody@test.com')).toBe(false);
  });

  test('Insert and delete a user in DB', () => {
    const newUser = {
      email: `temp${Date.now()}@testmail.com`,
      name: 'Temp User',
      password: 'Test@123',
      status: 'active' as const,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    const inserted = db.insertUser(newUser);
    expect(inserted.email).toBe(newUser.email);
    expect(db.userExists(newUser.email)).toBe(true);

    const deleted = db.deleteUser(newUser.email);
    expect(deleted).toBe(true);
    expect(db.userExists(newUser.email)).toBe(false);
  });

  test('Insert duplicate email throws error', () => {
    expect(() =>
      db.insertUser({
        email: process.env.LOGIN_EMAIL!,
        name: 'Duplicate',
        password: 'Test@123',
        status: 'active',
        role: 'user',
        createdAt: new Date().toISOString(),
      })
    ).toThrow(/already exists/);
  });

  test('Update user status to inactive', () => {
    // Insert temp user
    const email = `status${Date.now()}@testmail.com`;
    db.insertUser({
      email,
      name: 'Status User',
      password: 'Test@123',
      status: 'active',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    expect(db.updateUserStatus(email, 'inactive')).toBe(true);
    expect(db.isUserActive(email)).toBe(false);

    // Cleanup
    db.deleteUser(email);
  });

});
