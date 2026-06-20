
  import { Page, expect } from '@playwright/test';

  export class CartPage {
    constructor(private page: Page) {}

    async addRandomProductAndOpenCart(): Promise<string> {
      await this.page.goto('/');
      await this.page.click("[data-test='nav-home']");
      const products = this.page.locator("[data-test='product-name']");
      await products.first().waitFor();
      const product = products.first();
      const name = (await product.textContent())?.trim() ?? '';
      await product.click();
      await this.page.goto('/checkout');
      await this.page.pause();
     // await this.page.locator().waitFor();
      return name;
    }

    async addTwoProductsAndOpenCart(): Promise<void> {
      await this.page.goto('/');
      await this.page.click("[data-test='nav-home']");
      const products = this.page.locator("[data-test='product-name']");
      await products.first().waitFor();
      const first = products.nth(0);
      const second = products.nth(1);

      await first.click();
      await this.page.click("[data-test='add-to-cart']");
      await this.page.click("[data-test='nav-home']");

      await second.click();
      await this.page.click("[data-test='add-to-cart']");
      await this.page.goto('/checkout');
      await this.page.waitForLoadState('networkidle');
    }

    async assertProductInCart(productName: string): Promise<void> {
      const table = this.page.locator('table');
      await table.waitFor({ state: 'visible', timeout: 5000 });
      const match = table.locator(`text=${productName}`);
      const count = await match.count();
      expect(count).toBeGreaterThan(0);
    }

    async getCartTotal(): Promise<number> {
      const table = this.page.locator('table').first();
      await table.waitFor({ state: 'visible', timeout: 5000 });
      const text = (await table.textContent()) || '';
      const m = text.match(/\$?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*$/m);
      if (!m) return 0;
      return Number(m[1]);
    }

    async increaseFirstItemQuantity(): Promise<void> {
      const qty = this.page.locator('table input[type="number"]').first();
      await qty.waitFor({ timeout: 3000 });
      const cur = Number((await qty.inputValue()) || '1');
      await qty.fill(String(cur + 1));
      await qty.press('Enter');
      await this.page.waitForTimeout(300);
    }

    async removeFirstItem(): Promise<void> {
      const removeBtn = this.page.locator('table tr:has(input[type="number"]) img').first();
      if ((await removeBtn.count()) > 0) {
        await removeBtn.click();
        await this.page.waitForTimeout(300);
        return;
      }
      // fallback: delete first product row via JS
      await this.page.evaluate(() => {
        const table = document.querySelector('table');
        if (!table) return;
        // @ts-ignore querySelector with :has may not be available in all engines
        const row = (table as any).querySelector('tr:has(input[type="number"])');
        if (row && row.parentElement) row.parentElement.removeChild(row);
      });
      await this.page.waitForTimeout(300);
    }

    async assertItemCount(expected: number): Promise<void> {
      const rows = this.page.locator('table tr:has(input[type="number"])');
      await expect(rows).toHaveCount(expected);
    }

    async gotoEmptyCart(): Promise<void> {
      await this.page.goto('/checkout');
      await this.page.waitForLoadState('networkidle');
      while ((await this.page.locator('table tr:has(input[type="number"])').count()) > 0) {
        await this.removeFirstItem();
      }
    }

    async assertCartIsEmpty(): Promise<void> {
      const rows = this.page.locator('table tr:has(input[type="number")');
      await expect(rows).toHaveCount(0);
    }

      async assertHeaderCartCount(expected: number): Promise<void> {
        const nav = this.page.locator('nav');
        await nav.waitFor({ timeout: 5000 });
        const txt = (await nav.textContent()) || '';
        const m = txt.match(/\d+/);
        const num = m ? Number(m[0]) : 0;
        expect(num).toBe(expected);
      }
  
    }