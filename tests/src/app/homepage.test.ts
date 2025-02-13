import { test, expect } from '@playwright/test';
import { waitFor } from '@testing-library/react';
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

    const validationResult = page.locator('[data-testid="validation-result-display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');
  });

  test('should display error for invalid file', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', INVALID_ASSESSMENT_RESULT_PATH);

    const validationResult = page.locator('[data-testid="validation-result-display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should display an error if the file is empty', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', EMPTY_PATH);

    const validationResult = page.locator('[data-testid="validation-result-display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('error');
    await expect(validationResult).not.toContainText('errors');
  });

  test('should run validation when a file is changed', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    let validationResult = page.locator('[data-testid="validation-result-display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('"valid": true');

    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', INVALID_ASSESSMENT_RESULT_PATH);

    await page.click('[data-testid="upload-button-options-drawer"]');

    validationResult = page.locator('[data-testid="validation-result-display"]');
    await expect(validationResult).toBeVisible();
    await expect(validationResult).toContainText('errors');
  });

  test('should disable the file upload button when a file is being validated', async ({ page }) => {
    await page.click('[data-testid="upload-button-options-drawer"]');
    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', VALID_COMPONENT_DEFINITION_PATH);

    const fileUploadButton = page.locator('[data-testid="upload-button-options-drawer"]');
    await expect(fileUploadButton).toBeDisabled();
  });

  test('should display the file list when a file is uploaded', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    const fileList = page.locator('[data-testid="file-list"]');
    await expect(fileList).toBeVisible();
    await expect(fileList).toContainText('valid-component....yaml');
  });

  test('should display more than one file in the file list', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    await page.click('[data-testid="upload-button-options-drawer"]');
    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', INVALID_ASSESSMENT_RESULT_PATH);

    const fileList = page.locator('[data-testid="file-list"]');
    const fileListItems = await fileList.locator('button').all();
    expect(fileListItems).toHaveLength(2);
  });

  test('should delete a file from the file list', async ({ page }) => {
    await page.click('[data-testid="upload-button-options-drawer"]');
    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', INVALID_ASSESSMENT_RESULT_PATH);

    const deleteButton = page.locator('[data-testid="delete-button-options-drawer"]');
    await expect(deleteButton).toBeEnabled({ timeout: 1000 });

    const fileList = page.locator('[data-testid="file-list"]');
    const fileListItems = await fileList.locator('button').all();
    expect(fileListItems).toHaveLength(1);

    await deleteButton.click();

    const noFileSelected = page.locator('[data-testid="no-file-selected"]');
    await expect(noFileSelected).toBeVisible();
  });

  test('should be able to upload a file and then delete it and upload again', async ({ page }) => {
    await page.click('[data-testid="file-upload-button"]');
    await page.setInputFiles('[data-testid="file-upload-input"]', VALID_COMPONENT_DEFINITION_PATH);

    await page.click('[data-testid="upload-button-options-drawer"]');
    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', INVALID_ASSESSMENT_RESULT_PATH);

    const deleteButton = page.locator('[data-testid="delete-button-options-drawer"]');
    await expect(deleteButton).toBeEnabled({ timeout: 1000 });

    await deleteButton.click();

    await page.click('[data-testid="upload-button-options-drawer"]');
    await page.setInputFiles('[data-testid="options-drawer-file-upload"]', INVALID_ASSESSMENT_RESULT_PATH);

    await expect(deleteButton).toBeEnabled({ timeout: 1000 });

    const fileList = page.locator('[data-testid="file-list"]');
    const fileListItems = await fileList.locator('button').all();
    expect(fileListItems).toHaveLength(2);
  });
});
