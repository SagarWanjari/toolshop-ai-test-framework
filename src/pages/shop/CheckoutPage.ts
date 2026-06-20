import { Page, expect } from '@playwright/test';
import { CheckoutData } from '@types-custom/index';

export class CheckoutPage {
  constructor(private page: Page) {}

  async addProductAndProceedToCheckout(): Promise<void> {
    await this.page.goto('/');
    await this.page.click("[data-test='nav-home']");
    await this.page.locator("[data-test='product-name']").first().click();
    await this.page.click("[data-test='add-to-cart']");
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async addSpecificProductWithQuantity(quantity: number): Promise<{ productPrice: number; quantity: number }> {
    await this.page.goto('/');
    await this.page.click("[data-test='nav-home']");
    await this.page.locator("[data-test='product-name']").first().click();
    const priceText = (await this.page.locator("[data-test='unit-price'], [data-test='product-price']").first().textContent()) || '';
    const productPrice = Number(priceText.replace(/[^0-9.]/g, '')) || 0;
    const qtyInput = this.page.locator("[data-test='quantity'], input[type='number']").first();
    await qtyInput.fill(String(quantity));
    await this.page.click("[data-test='add-to-cart']");
    return { productPrice, quantity };
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async fillShippingAddress(data: CheckoutData): Promise<void> {
    // Try common selectors; keep simple and resilient
    if (data.firstName !== undefined) {
      const first = this.page.locator("[data-test='firstName'], [name='firstName']");
      if ((await first.count()) > 0) await first.fill(data.firstName);
      else await this.page.getByPlaceholder('First name *').fill(data.firstName).catch(() => {});
    }
    if (data.lastName !== undefined) {
      const last = this.page.locator("[data-test='lastName'], [name='lastName']");
      if ((await last.count()) > 0) await last.fill(data.lastName);
      else await this.page.getByPlaceholder('Last name *').fill(data.lastName).catch(() => {});
    }
    if (data.address !== undefined) {
      const addr = this.page.locator("[data-test='address'], [name='address']");
      if ((await addr.count()) > 0) await addr.fill(data.address);
      else await this.page.getByLabel('Street').fill(data.address).catch(() => {});
    }
    if (data.city !== undefined) {
      const city = this.page.locator("[data-test='city'], [name='city']");
      if ((await city.count()) > 0) await city.fill(data.city);
      else await this.page.getByLabel('City').fill(data.city).catch(() => {});
    }
    if (data.state !== undefined) {
      const state = this.page.locator("[data-test='state'], [name='state']");
      if ((await state.count()) > 0) await state.fill(data.state);
      else await this.page.getByLabel('State').fill(data.state).catch(() => {});
    }
    if (data.country !== undefined) {
      const country = this.page.locator("[data-test='country'], select[name='country']");
      if ((await country.count()) > 0) await country.selectOption({ label: data.country }).catch(() => {});
      else await this.page.locator("[data-test='country']").selectOption({ label: data.country }).catch(() => {});
    }
    if (data.postcode !== undefined) {
      const pc = this.page.locator("[data-test='postcode'], [name='postcode']");
      if ((await pc.count()) > 0) await pc.fill(data.postcode);
      else await this.page.getByPlaceholder('Your Postcode *').fill(data.postcode).catch(() => {});
    }
  }

  async selectPaymentMethod(method: string): Promise<void> {
    // Try radio/button or inputs
    const byDataTest = this.page.locator(`[data-test='payment-${method}']`);
    if ((await byDataTest.count()) > 0) {
      await byDataTest.click();
      return;
    }
    const byInput = this.page.locator(`input[name='paymentType'][value='${method}']`);
    if ((await byInput.count()) > 0) {
      await byInput.check();
      return;
    }
    // fallback: click label containing method text
    await this.page.click(`text=${method}`).catch(() => {});
  }

  async confirmOrder(): Promise<void> {
    const btn = this.page.locator("[data-test='confirm-order'], [data-test='place-order']");
    if ((await btn.count()) > 0) {
      await btn.first().click();
    } else {
      await this.page.getByRole('button', { name: /confirm|place order|order now/i }).first().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async assertOrderConfirmation(): Promise<void> {
    const conf = this.page.locator("[data-test='order-confirmation'], text=Thank you");
    await expect(conf.first()).toBeVisible();
  }

  async getOrderId(): Promise<string> {
    const idEl = this.page.locator("[data-test='order-id'], [data-test='order-reference']");
    if ((await idEl.count()) > 0) return (await idEl.first().textContent())?.trim() || '';
    const text = (await this.page.textContent('body')) || '';
    const m = text.match(/Order\s*(?:ID|#|reference)[:\s]*([A-Za-z0-9-]+)/i);
    return m ? (m[1] ?? '') : '';
  }

  async assertFieldRequired(field: string): Promise<void> {
    await expect(this.page.locator(`[data-test='${field}-error']`).first()).toBeVisible();
  }

  async assertOrderTotal(expected: number): Promise<void> {
    const el = this.page.locator("[data-test='order-total'], [data-test='checkout-total']");
    const text = (await el.first().textContent()) || '';
    const total = Number((text.match(/\d+(?:\.\d+)?/) || ['0'])[0]);
    expect(total).toBeCloseTo(expected, 2);
  }
}
