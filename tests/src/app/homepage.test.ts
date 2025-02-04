import { test, expect } from '@playwright/test';
import path from 'path';

const VALID_COMPONENT_DEFINITION_PATH = path.join(
  __dirname,
  '../../../test-data/oscal/valid-component-definition.yaml'
);
const INVALID_ASSESSMENT_RESULT_PATH = path.join(__dirname, '../../../test-data/oscal/invalid-assessment-result.yaml');
const EMPTY_PATH = path.join(__dirname, '../../../test-data/oscal/empty.json');

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display the home page with correct title and elements', async ({ page }) => {
    await expect(page.locator('[data-testid="home-page"]')).toBeVisible();
  });

  test('should upload a file and validate it', async ({ page }) => {
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    await page.click('[data-testid="file-upload-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');
  });

  test('should display error for invalid file', async ({ page }) => {
    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    await page.click('[data-testid="file-upload-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should display an error if the file is empty', async ({ page }) => {
    await page.setInputFiles('[data-testid="file-upload-input"]', EMPTY_PATH);

    await page.click('[data-testid="file-upload-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('error');
    await expect(validationResult).not.toContainText('errors');
  });

  test('should display a loading spinner when the file is being validated', async ({ page }) => {
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    await page.click('[data-testid="file-upload-button"]');

    const loadingSpinner = await page.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible();
  });

  test('should run validation when a file is changed', async ({ page }) => {
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    await page.click('[data-testid="file-upload-button"]');

    let validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');

    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    await page.click('[data-testid="file-upload-button"]');

    validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });
});
