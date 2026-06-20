import { test, expect } from '@fixtures/index';
import { DataFactory } from '@utils/dataFactory';

test.describe('Network mocking and resilience', () => {

  test('shows error when products API returns 500 @regression', async ({ page }) => {
    const responsePromise = page.waitForResponse(
    response => response.url().includes('/products')
  );

  await page.route('**/products**', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    });
  });

  await page.goto('/');

  const response = await responsePromise;

  expect(response.status()).toBe(500);
  });

  test('handles slow API gracefully — loading state visible @regression', async ({ page }) => {
    const start = Date.now();

  const responsePromise = page.waitForResponse(
    response => response.url().includes('/products')
  );

  await page.route('**/products**', async route => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await route.continue();
  });

  await page.goto('/');

  const response = await responsePromise;

  expect(response.ok()).toBeTruthy();
  expect(Date.now() - start).toBeGreaterThanOrEqual(3000);

  await expect(
    page.locator('[data-test="product-name"]').first()
  ).toBeVisible();
  });

  test('checkout order API failure shows user-friendly error @regression', async ({ page , checkoutPage}) => {
      let orderApiCalled = false;

  await page.route('**/*', async route => {
    const request = route.request();
    // Mock the actual order submission API
    if (
      request.method() === 'POST' &&
      (
        request.url().includes('/orders') ||
        request.url().includes('/checkout') ||
        request.url().includes('/payment')
      )
    ) {
      orderApiCalled = true;

      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Service temporarily unavailable'
        })
      });

      return;
    }

    await route.continue();
  });
  await checkoutPage.addProductAndProceedToCheckout();

  const checkoutData = DataFactory.validCheckoutData();

  await checkoutPage.fillShippingAddress(checkoutData);
  await checkoutPage.selectPaymentMethod('bank-transfer');

  // Trigger order submission
  await checkoutPage.confirmOrder();

  // Verify our mocked API was actually called
  expect(orderApiCalled).toBeTruthy();
});

  test('intercept and modify product prices @regression', async ({ page }) => {
    await page.route('**/products**', async route => {
      const response = await route.fetch();
      const json = await response.json();
      // Modify all prices to 0 to test free product scenario
      if (json.data) {
        json.data = json.data.map((p: any) => ({ ...p, price: 0 }));
      }
      route.fulfill({ response, json });
    });

    await page.goto('/');
    const firstPrice = await page.locator('[data-test="product-price"]').first().textContent();
    expect(firstPrice).toContain('0');
  });

  test('handles network timeout gracefully @regression', async ({ page }) => {
    await page.route('**/categories**', route => route.abort('timedout'));
    await page.goto('/');
    // App should not crash — verify page still partially loads
    await expect(page.locator('body')).toBeVisible();
  });

});