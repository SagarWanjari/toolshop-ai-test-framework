import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from "@pages/auth/LoginPage";

const authFile = path.join(__dirname,'../../.auth/user.json');

setup('authenticate as standard user', async ({page}) =>{
    const  authDir = path.dirname(authFile);
    if(!fs.existsSync(authDir)) fs.mkdirSync(authDir, {recursive:true});

    // const loginPage = new LoginPage(page);
    // await loginPage.goto();
    // await loginPage.userRegisterAccount();
    // await expect(page).toHaveURL("https://practicesoftwaretesting.com/auth/login");

    await page.goto('/auth/login');
    await page.fill('[data-test="email"]', process.env.USER_EMAIL!);
    await page.fill('[data-test="password"]', process.env.USER_PASSWORD!);
    await page.click('[data-test="login-submit"]');
    await expect(page).toHaveURL(/account/);
    await page.context().storageState({ path: authFile });
    console.log('Auth state saved successfully');

});