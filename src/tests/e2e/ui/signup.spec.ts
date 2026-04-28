import { test } from '@playwright/test';
import { SignupPage } from '../../../pages/SignupPage';
import { generateUser } from '../../../utils/testData';

test.describe('Signup - UI', () => {

  test('Signup with dynamic generated data', async ({ page }) => {
    const signup = new SignupPage(page);
    const user = generateUser();

    await signup.navigate();
    await signup.enterNameAndEmail(user.name, user.email);
    await signup.fillAccountDetails({ password: user.password });
    await signup.verifyAccountCreated();
  });

  test('Signup with already registered email shows error', async ({ page }) => {
    const signup = new SignupPage(page);

    await signup.navigate();
    await signup.enterNameAndEmail('Naresh Reddy', process.env.LOGIN_EMAIL!);
    await signup.verifyEmailAlreadyExists();
  });

});
