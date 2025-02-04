# Testing Guide

This document provides guidelines for writing and organizing Playwright and Jest tests in the project.

## Playwright Testing

### Project Structure

Playwright tests are located in the `oscalot/tests` directory. This is specified in the Playwright configuration file.

### Naming Convention

- **Test Files**: Use `.spec.ts` or `.test.ts` as the suffix for your test files. For example, `app-load.test.ts`.
- **Test IDs**: Use `data-testid` attributes in your components to make elements easily selectable in tests.

### Writing a Playwright Test

1. **Create a Test File**: Place your test file in the `tests` directory, e.g., `oscalot/tests/src/app/app-load.test.ts`.

2. **Write the Test**: Use Playwright's `test` and `expect` functions to define and run your tests.

   ```typescript
   import { test, expect } from '@playwright/test';
   import { metadata } from '@/lib/metadata';

   test('basic test', async ({ page }) => {
     // Navigate to the application
     await page.goto('http://localhost:3000');

     // Check if the page title is correct
     await expect(page).toHaveTitle(metadata.title as string);

     // Verify the presence of a specific element
     const element = page.locator('[data-testid="home-page"]');
     await expect(element).toBeVisible();
   });
   ```

3. **Run the Test**: Use the following command to run your Playwright tests:

   ```bash
   npx playwright test
   ```

## Jest Testing

### Project Structure

Jest tests can be placed in a `__tests__` directory or alongside the components they test. The Jest configuration is set up in `jest.config.js`.

### Naming Convention

- **Test Files**: Use `.test.tsx` or `.spec.tsx` as the suffix for your test files. For example, `Button.test.tsx`.

### Writing a Jest Test

1. **Create a Test File**: Place your test file in the `__tests__` directory or next to the component, e.g., `oscalot/src/components/Button.test.tsx`.

2. **Write the Test**: Use Jest and Testing Library to define and run your tests.

   ```typescript
   import { render, screen } from '@testing-library/react';
   import '@testing-library/jest-dom';
   import Button from '../Button';

   test('renders the button with the correct text', () => {
     render(<Button>Click Me</Button>);
     const buttonElement = screen.getByText(/Click Me/i);
     expect(buttonElement).toBeInTheDocument();
   });
   ```

3. **Run the Test**: Use the following command to run your Jest tests:

   ```bash
   npm test
   ```

## Summary

- **Playwright**: Use for end-to-end testing. Place tests in the `tests` directory and use `.spec.ts` or `.test.ts` suffixes.
- **Jest**: Use for unit testing. Place tests in a `__tests__` directory or alongside components, using `.test.tsx` or `.spec.tsx` suffixes.

By following these guidelines, you can maintain a consistent and organized testing strategy across your project.
