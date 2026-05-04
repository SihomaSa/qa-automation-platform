# QA Automation Platform

> Full-stack test automation framework built with **Playwright**, **TypeScript**, and **Cucumber BDD** — covering E2E, API, and CI layers.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| E2E Browser | Playwright 1.41 |
| Language | TypeScript 5 |
| BDD | Cucumber 10 + Gherkin |
| API Testing | Axios + Zod schema validation |
| CI/CD | GitHub Actions |
| Containerization | Docker + docker-compose |
| Reporting | Allure + Cucumber HTML |

---

## Project Structure

```
qa-automation-platform/
├── src/
│   ├── features/
│   │   ├── e2e/          # Browser-level Gherkin feature files
│   │   └── api/          # API-level Gherkin feature files
│   ├── steps/            # Step definitions (TypeScript)
│   ├── pages/            # Page Object Model classes
│   ├── api/              # API clients and service layers
│   ├── support/          # World, Hooks, shared setup
│   └── utils/            # TestDataFactory, Assert helpers
├── config/
│   └── env.ts            # Type-safe env loader (Zod)
├── .github/
│   └── workflows/
│       └── qa-pipeline.yml
├── cucumber.config.ts
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Local setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps chromium

# 3. Copy env file and configure
cp .env.example .env

# 4. Run smoke tests
npm run test:smoke
```

### Run by suite

```bash
npm run test:e2e        # E2E browser tests only
npm run test:api        # API integration tests only
npm run test:all        # Full suite
npm run test:smoke      # @smoke tagged scenarios
npm run test:regression # @regression tagged scenarios
```

### Run in Docker

```bash
# Full suite (containerized)
docker-compose run qa-tests

# Smoke only
docker-compose run qa-smoke

# With Allure server on http://localhost:5050
docker-compose up allure
```

---

## CI/CD Pipeline

The GitHub Actions pipeline runs on every push and PR:

1. **Lint & type check** — ESLint + tsc
2. **API tests** — fast, no browser needed
3. **E2E tests** — parallel across Chromium + Firefox
4. **Allure report** — auto-generated and published to GitHub Pages

Pipeline visualization:

```
push/PR
  │
  ├─► lint-and-type-check
  │
  ├─► api-tests ─────────────────┐
  │                              ▼
  └─► e2e-tests (chromium)  ► allure-report ► GitHub Pages
      e2e-tests (firefox)
```

---

## Writing New Tests

### 1. Add a feature file

```gherkin
# src/features/e2e/products.feature
@e2e @regression
Feature: Product catalog
  Scenario: View product details
    Given I am on the home page
    When I click on the first product
    Then I should see the product detail page
```

### 2. Add step definitions

```typescript
// src/steps/products.steps.ts
When('I click on the first product', async function (this: CustomWorld) {
  await this.page.locator('.product-image-wrapper').first().click()
})
```

### 3. Add a Page Object (if needed)

```typescript
// src/pages/ProductPage.ts
export class ProductPage extends BasePage {
  readonly productName = this.page.locator('.product-information h2')
  // ...
}
```

---

## Reporting

After a test run, open the HTML report:

```bash
# Allure (rich, with history)
npm run report

# Quick Cucumber HTML
open reports/cucumber-report.html
```

Screenshots on failure are saved to `reports/screenshots/` and attached to the Allure report automatically.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://automationexercise.com` | App under test |
| `API_BASE_URL` | `…/api` | API base |
| `BROWSER` | `chromium` | `chromium`, `firefox`, `webkit` |
| `HEADLESS` | `true` | Run without UI |
| `TIMEOUT` | `30000` | Global timeout (ms) |
| `RETRIES` | `1` | Retry failed tests |
| `SCREENSHOT_ON_FAIL` | `true` | Capture screenshot on failure |

---

## Contributing

1. Branch naming: `feature/`, `fix/`, `chore/`
2. All new scenarios need at least `@smoke` or `@regression` tag
3. Page Objects for any new page — no bare `page.locator()` in step definitions
4. Run `npm run type-check` and `npm run lint` before pushing
