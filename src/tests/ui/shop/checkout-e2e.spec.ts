import { test, expect } from '@fixtures/index'
import { DataFactory } from '@utils/dataFactory';

test.describe('Checkout E2E flows', () => {

  test.only('complete purchase with bank transfer @smoke @critical', async ({ checkoutPage }) => {
    await checkoutPage.addProductAndProceedToCheckout();
    const checkoutData = DataFactory.validCheckoutData();
    await checkoutPage.fillShippingAddress(checkoutData);
    await checkoutPage.selectPaymentMethod('bank-transfer');
    await checkoutPage.confirmOrder();
    await checkoutPage.assertOrderConfirmation();
    const orderId = await checkoutPage.getOrderId();
    expect(orderId).toBeTruthy();
  });

  test('complete purchase with cash on delivery @regression @critical', async ({ checkoutPage }) => {
    await checkoutPage.addProductAndProceedToCheckout();
    await checkoutPage.fillShippingAddress(DataFactory.validCheckoutData());
    await checkoutPage.selectPaymentMethod('cash-on-delivery');
    await checkoutPage.confirmOrder();
    await checkoutPage.assertOrderConfirmation();
  });

  test('checkout fails with missing first name @regression', async ({ checkoutPage }) => {
    await checkoutPage.addProductAndProceedToCheckout();
    await checkoutPage.fillShippingAddress(DataFactory.invalidCheckoutData('firstName'));
    await checkoutPage.assertFieldRequired('firstName');
  });

  test('checkout fails with missing address @regression', async ({ checkoutPage }) => {
    await checkoutPage.addProductAndProceedToCheckout();
    await checkoutPage.fillShippingAddress(DataFactory.invalidCheckoutData('address'));
    await checkoutPage.assertFieldRequired('address');
  });

  test('order total is calculated correctly @critical', async ({ checkoutPage }) => {
    const { productPrice, quantity } = await checkoutPage.addSpecificProductWithQuantity(2);
    await checkoutPage.proceedToCheckout();
    await checkoutPage.assertOrderTotal(productPrice * quantity);
  });

});