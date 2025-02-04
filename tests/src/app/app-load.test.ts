import { test, expect } from '@playwright/test';
import { metadata } from '@/lib/metadata';

test('basic test', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000'); // Replace with your app's URL

  // Check if the page title is correct
  await expect(page).toHaveTitle(metadata.title as string);

  // Verify the presence of a specific element
  const element = page.locator('[data-testid="home-page"]'); // Replace with your element's selector
  await expect(element).toBeVisible();
});
