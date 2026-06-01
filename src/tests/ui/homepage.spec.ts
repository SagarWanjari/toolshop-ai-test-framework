import { test, expect } from '@playwright/test';

test('homepage loads with products visible @smoke', async ({page}) => {

    await page.goto('/');
    await expect(page).toHaveTitle(/Practice Software Testing/);
    await expect(page.locator('[data-test="product-name"]').first()).toBeVisible();
    
});

test('search returns relevant results @smoke', async ({page}) =>{
    await page.goto('/');
    await page.fill('[data-test="search-query"]', 'hammer');
    await page.click('[data-test="search-submit"]');
     await expect(page.locator('[data-test="product-name"]').first()).toContainText(/hammer/i);
});

test('category filter works @regression', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-test="category-01KT1A1A7D3V67BY2N6MXMXN5Y"]'); 
  const products = page.locator('[data-test="product-name"]');
  await expect(products.first()).toBeVisible();
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});

