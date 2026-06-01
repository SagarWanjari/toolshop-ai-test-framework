import { Locator, Page } from "@playwright/test";


export class LoginPage{
    readonly page:Page;
    readonly clickRegisterAccount:Locator
    readonly firstName:Locator
    readonly lastName:Locator
    readonly DOB:Locator;
    readonly Country:Locator;
    readonly postCode:Locator;
    readonly houseNumber: Locator;
    readonly street: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly phone:Locator;
    readonly email:Locator;
    readonly password:Locator;
    readonly registerBtn:Locator;

    constructor(page:Page){
        this.page = page;
        this.clickRegisterAccount = page.locator("[data-test='register-link']");
        this.firstName = page.getByPlaceholder("First name *");
        this.lastName = page.getByLabel("Last Name");
        this.DOB = page.getByPlaceholder("YYYY-MM-DD");
        this.Country = page.locator("[data-test='country']");
        this.postCode = page.getByPlaceholder("Your Postcode *");
        this.houseNumber = page.getByLabel("House number");
        this.street = page.getByLabel("Street");
        this.city = page.getByLabel("City");
        this.state = page.getByLabel("State");
        this.phone = page.getByLabel("Phone");
        this.email = page.getByLabel("Email address");
        this.password = page.getByLabel("Password");
        this.registerBtn = page.getByRole("button",{name:"Register"})

    }
    async goTo(url:string){
        await this.page.goto(url);
    }
    async userRegisterAccount(){
        await this.clickRegisterAccount.click();
        await this.firstName.fill("Ram");
        await this.lastName.fill("Sharma");
        await this.DOB.fill("2000-09-25");
        await this.Country.selectOption({label: "India"});
        await this.postCode.fill("411057");
        await this.houseNumber.fill("13");
        await this.street.fill("Marunji Road");
        await this.city.fill("Pune");
        await this.state.fill("Maharashtra");
        await this.phone.fill("1234567890");
        await this.email.fill("ram.sharma@xyx.com");
        await this.password.fill("RamSharma@123");
        await this.registerBtn.click();
    }
}