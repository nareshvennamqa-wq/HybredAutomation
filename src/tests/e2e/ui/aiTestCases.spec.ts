import { test } from '@playwright/test';
import { generateTestCases } from '../../../utils/ollamaHelper';
import { generatePlaywrightTests } from '../../../utils/testGenerator';
import { TestCase } from '../../../types';

test('Generate Playwright tests from AI and write to disk', async () => {
  const output = await generateTestCases('Login functionality');

  let testCases: TestCase[] = [];

  try {
    testCases = JSON.parse(output);
  } catch (err) {
    console.error('Failed to parse AI output as JSON:', err);
    return;
  }

  console.log(`Parsed ${testCases.length} test case(s) from AI`);

  generatePlaywrightTests(testCases);

  console.log('Playwright test file generated at src/tests/e2e/ui/aiGenerated.spec.ts');
});
