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
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    const validationResult = page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');
  });

  test('should display error for invalid file', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    const validationResult = page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should display an error if the file is empty', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', EMPTY_PATH);

    const validationResult = page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('error');
    await expect(validationResult).not.toContainText('errors');
  });

  test('should run validation when a file is changed', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    let validationResult = page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');

    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    await page.click('[data-testid="file-upload-button"]');

    validationResult = page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should display a loading spinner when the file is being validated', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    // Wait for the loading spinner to appear
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible({ timeout: 10000 });

    // Optionally, wait for the spinner to disappear if you want to ensure it was shown during the process
    await expect(loadingSpinner).not.toBeVisible({ timeout: 10000 }); // Adjust timeout as needed
  });

  test('should disable the file upload button when a file is being validated', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    const fileUploadButton = page.locator('[data-testid="file-upload-button"]');
    await expect(fileUploadButton).toBeDisabled();
  });
});
