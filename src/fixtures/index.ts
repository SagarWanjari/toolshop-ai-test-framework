import { test as base , expect } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { HomePage } from '@pages/shop/HomePage';


type Fixtures = {
    loginPage : LoginPage;
    homePage : HomePage;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));

    },
    homePage : async ({page}, use) =>{
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await use ( new HomePage(page));
    }
});

export { expect };