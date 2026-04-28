export async function generateUserData() {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      signal: AbortSignal.timeout(5000),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: 'Generate a random user with name and email in JSON format',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.response);
  } catch {
    return {
      name: 'TestUser',
      email: `user${Date.now()}@gmail.com`,
    };
  }
}
