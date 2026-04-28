import fs from 'fs';
import { TestCase } from '../types';

function escapeForSingleQuotedString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function resolveCredentials(testCase: TestCase) {
  const joined = `${testCase.title} ${testCase.steps.join(' ')} ${testCase.expectedResult}`.toLowerCase();

  const email =
    joined.includes('<invalid email>') || joined.includes('invalid email')
      ? 'nobody@fake.com'
      : joined.includes('<empty>')
        ? ''
        : "process.env.LOGIN_EMAIL!";

  const password =
    joined.includes('<incorrect password>') || joined.includes('wrong password')
      ? 'Totally$Wrong99'
      : joined.includes('enter password: <empty>') || joined.includes('empty password')
        ? ''
        : "process.env.LOGIN_PASSWORD!";

  return { email, password };
}

function buildExpectation(testCase: TestCase) {
  const text = `${testCase.title} ${testCase.expectedResult}`.toLowerCase();

  if (text.includes('logged in')) {
    return '    await login.verifyLoginSuccess();';
  }

  if (text.includes('block') || text.includes('browser validation')) {
    if (text.includes('password')) {
      return '    await login.verifyPasswordFieldFocused();';
    }

    return '    await login.verifyEmailFieldFocused();';
  }

  return '    await login.verifyLoginError();';
}

export function generatePlaywrightTests(testCases: TestCase[]) {
  let content = `
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

test.describe('AI Generated Login Tests', () => {
`;

  testCases.forEach((tc) => {
    const { email, password } = resolveCredentials(tc);
    const emailArg = email.startsWith('process.env.') ? email : `'${escapeForSingleQuotedString(email)}'`;
    const passwordArg = password.startsWith('process.env.') ? password : `'${escapeForSingleQuotedString(password)}'`;

    content += `
  test('${escapeForSingleQuotedString(tc.title)}', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login(
      ${emailArg},
      ${passwordArg}
    );

${buildExpectation(tc)}
  });
`;
  });

  content += `});`;

  fs.writeFileSync('src/tests/e2e/ui/aiGenerated.spec.ts', content);
}
