import { test as base , expect } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { HomePage } from '@pages/shop/HomePage';
import { productDetailPage } from '@pages/shop/ProductDetailPage';
import { CartPage } from '@pages/shop/CartPage';


type Fixtures = {
    loginPage : LoginPage;
    homePage : HomePage;
    productDetailPage : productDetailPage;
    cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));

    },
    homePage : async ({page}, use) =>{
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await use(new HomePage(page));
    },
    productDetailPage : async ({page}, use) => {
        await page.goto('/');
        await use(new productDetailPage(page));
    }
    ,
    cartPage: async ({ page }, use) => {
        await page.goto('/');
        await use(new CartPage(page));
    }
});

export { expect };