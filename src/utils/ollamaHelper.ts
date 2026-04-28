import { TestCase } from '../types';

const fallbackTestCases: TestCase[] = [
  {
    title: 'Login with valid credentials succeeds',
    steps: [
      'Enter email: <valid email>',
      'Enter password: <password>',
      'Click login',
    ],
    expectedResult: 'User should be logged in successfully',
  },
  {
    title: 'Login with invalid email shows error',
    steps: [
      'Enter email: <invalid email>',
      'Enter password: <password>',
      'Click login',
    ],
    expectedResult: 'An incorrect email or password error should be shown',
  },
  {
    title: 'Login with wrong password shows error',
    steps: [
      'Enter email: <valid email>',
      'Enter password: <incorrect password>',
      'Click login',
    ],
    expectedResult: 'An incorrect email or password error should be shown',
  },
  {
    title: 'Login with empty email is blocked',
    steps: [
      'Enter email: <empty>',
      'Enter password: <password>',
      'Click login',
    ],
    expectedResult: 'Browser validation should block the submission',
  },
  {
    title: 'Login with empty password is blocked',
    steps: [
      'Enter email: <valid email>',
      'Enter password: <empty>',
      'Click login',
    ],
    expectedResult: 'Browser validation should block the submission',
  },
];

export async function generateTestCases(feature: string): Promise<string> {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      signal: AbortSignal.timeout(5000),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt: `
Generate test cases for ${feature} in JSON format.

Rules:
- Each test case must be unique
- Steps must include placeholders like:
  <valid email>, <password>, <invalid email>, <incorrect password>
- Do NOT leave values empty
- Steps should contain only user actions (no validations/messages)
- Expected result should contain only outcome
- Keep steps clear and short
- Do not include explanations

Return strictly in this format:

[
  {
    "title": "Test case title",
    "steps": [
      "Enter email: <valid email>",
      "Enter password: <password>",
      "Click login"
    ],
    "expectedResult": "User should be logged in successfully"
  }
]
`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    const raw = typeof data.response === 'string' ? data.response.trim() : '';
    const match = raw.match(/\[.*\]/s);

    if (match) {
      return match[0];
    }
  } catch (error) {
    console.warn('Falling back to default test cases because Ollama is unavailable.');
  }

  return JSON.stringify(fallbackTestCases, null, 2);
}
