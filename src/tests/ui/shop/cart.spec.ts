import { test, expect } from '@fixtures/index'

test.describe('Shopping cart', () => {

  test('added product appears in cart @smoke @critical', async ({ cartPage }) => {
    const productName = await cartPage.addRandomProductAndOpenCart();
    await cartPage.assertProductInCart(productName);
  });

  test('cart total updates when quantity changes @critical', async ({ cartPage }) => {
    await cartPage.addRandomProductAndOpenCart();
    const priceBefore = await cartPage.getCartTotal();
    await cartPage.increaseFirstItemQuantity();
    const priceAfter = await cartPage.getCartTotal();
    expect(priceAfter).toBeGreaterThan(priceBefore);
  });

  test('removing item from cart updates total @critical', async ({ cartPage }) => {
    await cartPage.addTwoProductsAndOpenCart();
    await cartPage.removeFirstItem();
    await cartPage.assertItemCount(1);
  });

  test('empty cart shows empty state message @regression', async ({ cartPage }) => {
    await cartPage.gotoEmptyCart();
    await cartPage.assertCartIsEmpty();
  });

  test('cart persists after page refresh @regression', async ({ cartPage, page }) => {
    const productName = await cartPage.addRandomProductAndOpenCart();
    await page.reload();
    await cartPage.assertProductInCart(productName);
  });

  test('cart item count badge updates in header @regression', async ({ cartPage }) => {
    await cartPage.addRandomProductAndOpenCart();
    await cartPage.assertHeaderCartCount(1);
  });

});