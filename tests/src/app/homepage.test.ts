import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display the home page with correct title and elements', async ({ page }) => {
    await expect(page.locator('[data-testid="home-page"]')).toBeVisible();
  });

  test('should upload a file and validate it', async ({ page }) => {
    const filePath = path.join(__dirname, '../../../test-data/oscal/valid-component-definition.yaml');
    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);

    await page.click('[data-testid="file-upload-button"]');
    await page.click('[data-testid="validate-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');
  });

  test('should display error for invalid file', async ({ page }) => {
    const filePath = path.join(__dirname, '../../../test-data/oscal/invalid-assessment-result.yaml');
    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);

    await page.click('[data-testid="file-upload-button"]');
    await page.click('[data-testid="validate-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should display an error if the file is empty', async ({ page }) => {
    const filePath = path.join(__dirname, '../../../test-data/oscal/empty.json');
    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);

    await page.click('[data-testid="file-upload-button"]');
    await page.click('[data-testid="validate-button"]');

    const validationResult = await page.locator('[data-testid="validation-result-Display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('error');
    await expect(validationResult).not.toContainText('errors');
  });

  test('should display a loading spinner when the file is being validated', async ({ page }) => {
    const filePath = path.join(__dirname, '../../../test-data/oscal/valid-component-definition.yaml');
    await page.setInputFiles('[data-testid="file-upload-input"]', filePath);

    await page.click('[data-testid="file-upload-button"]');
    await page.click('[data-testid="validate-button"]');

    const loadingSpinner = await page.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible();
  });
});
