import { Page, expect } from "@playwright/test";


export class LoginPage{

constructor(private page:Page){};

   async goto():Promise<void>{
        await this.page.goto('auth/login');
   }

   async login(email:string, password:string): Promise<void>{
    await this.page.pause();
        if(email){
            await this.page.fill('[data-test="email"]', email);
        } 
        if(password){
            await this.page.fill('[data-test="password"]',password);
        }
        await this.page.click('[data-test="login-submit"]');
   }

   async loginAs(role:'customer' | 'admin'): Promise<void>{
        const credentials = {
            customer: {email: process.env.USER_EMAIL!, password: process.env.USER_PASSWORD!},
            admin: { email: process.env.ADMIN_EMAIL!, password: process.env.ADMIN_PASSWORD!},
        };
        await this.login(credentials[role].email, credentials[role].password);
        await this.page.waitForLoadState('networkidle');
    }

    async logout(): Promise<void>{
        await this.page.click('[data-test="nav-menu"]');
        await this.page.click('[data-test="nav-sign-out"]');
    }

    async assertLoggedIn(): Promise<void>{
        await expect(this.page.locator('[data-test="nav-menu"]')).toBeVisible();
        await expect(this.page).not.toHaveURL(/auth\/login/);
    }

    async assertAdminMenuVisible(): Promise<void>{
        await this.assertLoggedIn();
        await this.page.click('[data-test="nav-menu"]');
        await expect(this.page.locator('[data-test="nav-admin-dashboard"]')).toBeVisible();
        
    }

    async assertLoginError(message: string): Promise<void> {
    await expect(this.page.locator('[data-test="login-error"]')).toContainText(message);
    }

    async assertFieldError(field: string, message: string): Promise<void> {
    await expect(this.page.locator(`[data-test="${field}-error"]`)).toContainText(message);
    }

    async assertLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
    }

    async userRegisterAccount(){
        await this.page.click("[data-test='register-link']");

        await this.page.getByPlaceholder("First name *").fill("Ram");
        await this.page.getByLabel("Last Name").fill("Sharma");
        await this.page.getByPlaceholder("YYYY-MM-DD").fill("2000-09-25");
        await this.page.locator("[data-test='country']").selectOption({label: "India"});
        await this.page.getByPlaceholder("Your Postcode *").fill("411057");
        await this.page.getByLabel("House number").fill("13");
        await this.page.getByLabel("Street").fill("Marunji Road");
        await this.page.getByLabel("City").fill("Pune");
        await this.page.getByLabel("State").fill("Maharashtra");
        await this.page.getByLabel("Phone").fill("1234567890");
        await this.page.getByLabel("Email address").fill("ram.sharma@xyx.com");
        await this.page.getByLabel("Password").fill("RamSharma@123");
        await this.page.getByRole("button",{name:"Register"}).click();
    }
}