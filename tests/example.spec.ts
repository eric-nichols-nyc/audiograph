import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  
  // Expect the page to contain a specific title
  await expect(page).toHaveTitle(/AudioGPraph/);
});

test('navigates to artist page', async ({ page }) => {
  await page.goto('/');
  
  // Find and click a link to the artist page
  // Note: You'll need to update this selector to match your actual UI
  await page.getByRole('link', { name: /artist/i }).click();
  
  // Expect the URL to contain artist
  await expect(page).toHaveURL(/.*artist/);
});
