# AutomationExercise Playwright Test Suite

Playwright coverage for [automationexercise.com](https://automationexercise.com) across UI, API, and DB-style test layers.

## Project Structure

```text
automationexercise/
|-- src/
|   |-- helpers/
|   |   |-- ApiHelper.ts
|   |   `-- dbHelper.ts
|   |-- pages/
|   |   |-- BasePage.ts
|   |   |-- CartPage.ts
|   |   |-- LoginPage.ts
|   |   |-- ProductPage.ts
|   |   `-- SignupPage.ts
|   |-- tests/
|   |   `-- e2e/
|   |       |-- api/
|   |       |   |-- login.spec.ts
|   |       |   |-- products.spec.ts
|   |       |   `-- users.spec.ts
|   |       |-- db/
|   |       |   `-- users.spec.ts
|   |       `-- ui/
|   |           |-- aiGenerated.spec.ts
|   |           |-- aiTestCases.spec.ts
|   |           |-- login.spec.ts
|   |           |-- productCart.spec.ts
|   |           |-- signup.spec.ts
|   |           `-- storageState.setup.spec.ts
|   |-- types/
|   |   `-- index.ts
|   `-- utils/
|       |-- aiHelper.ts
|       |-- ollamaHelper.ts
|       |-- testData.ts
|       `-- testGenerator.ts
|-- playwright.config.ts
`-- package.json
```

## Setup

```bash
npm install
npx playwright install chromium
```

Create or update the root `.env` file:

```env
BASE_URL=https://automationexercise.com
LOGIN_EMAIL=your@email.com
LOGIN_PASSWORD=YourPassword
OLLAMA_BASE_URL=http://localhost:11434
```

## Running Tests

| Command | What it runs |
|---|---|
| `npm test` | Full suite |
| `npm run test:ui` | UI specs under `src/tests/e2e/ui` |
| `npm run test:api` | API specs under `src/tests/e2e/api` |
| `npm run test:db` | DB specs under `src/tests/e2e/db` |
| `npm run allure` | Full suite with Allure report generation |
| `npm run docker:test` | Full suite inside Docker |
| `npm run docker:test:ui` | UI specs inside Docker |
| `npm run docker:test:api` | API specs inside Docker |
| `npm run docker:test:db` | DB specs inside Docker |

## Docker

The project includes a Playwright-ready Docker image based on the official Microsoft Playwright container.

```bash
docker compose build
docker compose run --rm tests
```

Notes:

- Reports are written back to the local `allure-results`, `allure-report`, `playwright-report`, and `test-results` folders.
- The container runs in headless mode automatically.
- If you use Ollama-backed AI generation, set `OLLAMA_BASE_URL` in `.env`.
- On Docker Desktop, `http://host.docker.internal:11434` lets the container reach Ollama running on your machine.

## Git

Recommended Git-ready setup for this project:

- Keep `.env`, Playwright auth state, and generated reports out of version control.
- Commit source files, config, and workflow files.
- After Git is installed and available in your shell, initialize and commit:

```bash
git init -b main
git add .
git commit -m "Initial commit"
```

## Test Layers

### UI

Browser-driven Playwright tests using the page object model.

### API

HTTP-level tests using Playwright's `APIRequestContext`.

### DB

Unit-style tests against the in-memory `DbHelper` class.

### AI Test Generation

`src/tests/e2e/ui/aiTestCases.spec.ts` generates `src/tests/e2e/ui/aiGenerated.spec.ts`.
