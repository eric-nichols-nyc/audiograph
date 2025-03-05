# Testing in AudioGPraph

This project uses two testing frameworks:

1. **Playwright** for end-to-end testing
2. **Vitest** for unit and component testing

## End-to-End Testing with Playwright

Playwright tests are located in the `tests` directory with the `.spec.ts` extension. These tests simulate real user interactions with the application in a browser environment.

### Running Playwright Tests

```bash
# Run all Playwright tests
npm run test:e2e

# Run Playwright tests with UI
npm run test:e2e:ui
```

## Unit and Component Testing with Vitest

Vitest tests are located in the `tests/components` directory with the `.test.tsx` extension. These tests focus on testing individual components and functions in isolation.

### Running Vitest Tests

```bash
# Run all Vitest tests
npm run test

# Run Vitest tests in watch mode
npm run test:watch

# Run Vitest tests with UI
npm run test:ui
```

## Test Setup

- `tests/vitest.setup.ts`: Configuration for Vitest tests, including DOM testing utilities
- `playwright.config.ts`: Configuration for Playwright tests
- `vite.config.ts`: Includes test configuration for Vitest

## Writing Tests

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AudioGPraph/);
});
```

### Vitest Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });
});
