import { expect, Page } from "@playwright/test";
import { count } from "node:console";



export class HomePage {

constructor (private page:Page){};

async goto(): Promise<void>{
    await this.page.goto('auth/login');
    await this.page.click("[data-test='nav-home']");
}

async assertProductsVisible(): Promise<void>{
    await expect(this.page.locator("[data-test='product-name']").first()).toBeVisible();
}

async assertProductCountAtLeast(minCount:number): Promise<void>{
    const actualCount = await this.page.locator("[data-test='product-name']").count()
    await expect(actualCount).toBeGreaterThanOrEqual(minCount);
}

async searchFor(productName:string):Promise<void>{
    await this.page.fill("[data-test='search-query']",productName);  
    await this.page.click("[data-test='search-submit']"); 
}

async assertAllProductsContain(productName:string):Promise<void>{
    await this.page.locator("[data-test='search_completed']").waitFor(); 
    const products = this.page.locator("[data-test='product-name']");
    const productList = await products.allTextContents();
    expect(productList.length).toBeGreaterThan(0);
    for(const product of productList){
         await expect(product.toLowerCase()).toContain(productName.toLowerCase());
    }
}

async assertNoProductsFound():Promise<void>{
    await this.page.locator("[data-test='search_completed']").waitFor(); 
    await expect(this.page.locator("[data-test='product-name']")).toHaveCount(0);
    await expect(this.page.locator("[data-test='no-results']")).toBeVisible();
    await expect(this.page.locator("[data-test='no-results']")).toHaveText("There are no products found.");
}

async getProductCount():Promise<number>{  
    await this.page.waitForLoadState("networkidle");
    const actualCount = await this.page.locator("[data-test='product-name']").count() 
    return actualCount;
}

async filterByCategory(productName :string):Promise<void>{
    await this.page
        .locator(`text=${productName}`)
        .locator('input[type="checkbox"]').check();
    await this.page.locator("[data-test='filter_completed']").waitFor(); 
    
}

async sortBy(sortByType: string): Promise<void> {
    this.page.locator("[data-test='sort']").selectOption(sortByType);
}

async assertPricesInAscendingOrder():Promise<void>{
    await this.page.waitForLoadState("networkidle");
    const prices = await this.page.locator("[data-test='product-price']")
    await expect(prices.first()).toBeVisible();
    const allProductPrices = await prices.allTextContents()
    console.log("All Product Prices ASC" + allProductPrices);
    const productPrices= allProductPrices.map(price => Number(price.replace('$','').trim()));
    for(let i=0;i<productPrices.length-1;i++){
         expect(productPrices[i]!).toBeLessThanOrEqual(productPrices[i+1]!);
    }
}

async assertPricesInDescendingOrder():Promise<void>{
    await this.page.waitForLoadState("networkidle");
    const prices = this.page.locator("[data-test='product-price']")
    await expect(prices.first()).toBeVisible();
    const allProductPrices = await prices.allTextContents()
    console.log("All Product Prices DESC" + allProductPrices);
    const productPrices= allProductPrices.map(price => Number(price.replace('$','').trim()));
    for(let i=0;i<productPrices.length-1;i++){
         expect(productPrices[i]!).toBeGreaterThanOrEqual(productPrices[i+1]!);
    }
}

async assertFirstProductHasNamePriceImage():Promise<void>{
    expect(this.page.locator("img.card-img-top").first()).toBeTruthy();
    expect(this.page.locator(".card-title").first()).toBeTruthy();
    expect(this.page.locator("[data-test='product-price']").first()).toBeTruthy();
}
} 