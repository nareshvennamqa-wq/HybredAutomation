import { faker } from '@faker-js/faker';

export function generateUser() {
  return {
    name: 'Naresh Reddy',
    email: `naresh${Date.now()}@gmail.com`, // ✅ unique + personal
    password: 'Test@123',
  };
}

export function generateWrongPassword() {
  return `${faker.internet.password({ length: 12, memorable: false })}!`;
}
