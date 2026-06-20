import {Page, expect} from '@playwright/test';

export class productDetailPage{
    constructor (private page:Page){};
    async gotoFirstProduct():Promise<void>{
        await this.page.goto('auth/login');
        await this.page.click("[data-test='nav-home']");
        await this.page.locator("[data-test='product-name']").first().click();
    }

    async assertNameVisible():Promise<void>{
        await expect(this.page.locator("[data-test='product-name']")).toBeVisible();
    }
    
    async assertPriceVisible():Promise<void>{
        await expect(this.page.locator("[data-test='unit-price']")).toBeVisible();
    }
    async assertDescriptionVisible():Promise<void>{
        await expect(this.page.locator("[data-test='product-description']")).toBeVisible();
    }
    async assertImageVisible():Promise<void>{
        await expect(this.page.locator(".figure-img")).toBeVisible();
    }

    async setQuantity(quantity:number):Promise<void>{
        const quantityInput = this.page.locator("[data-test='quantity']");
        await quantityInput.fill(quantity.toString());
    }

    async addToCart():Promise<void>{
        await this.page.click("[data-test='add-to-cart']");
    }

    async assertCartBadgeCount(expectedCount:number):Promise<void>{
        const badge = this.page.locator("[data-test='cart-quantity']");
        await expect(badge).toHaveText(expectedCount.toString());
    }

    async assertQuantityIs(expectedQuantity:number):Promise<void>{
        const quantityInput = this.page.locator("[data-test='quantity']");
        await expect(quantityInput).toHaveValue(expectedQuantity.toString());
    }

    async gotoOutOfStockProduct():Promise<void>{
        await this.page.goto('auth/login');
        await this.page.click("[data-test='nav-home']");
        await this.page.locator("//span[@data-test='out-of-stock']/ancestor::a//h5[@data-test='product-name']").first().click();
    }

    async assertAddToCartDisabled():Promise<void>{
        const addToCartButton = this.page.locator("[data-test='add-to-cart']");
        await expect(addToCartButton).toBeDisabled();
    }          

    async clickSecondThumbnail():Promise<void>{
        const secondThumbnail = this.page.locator(".thumbnail").nth(1);
        await secondThumbnail.click();
    }

    async assertMainImageChanged():Promise<void>{
        const mainImage = this.page.locator(".figure-img");
        await expect(mainImage).toHaveAttribute("src", /.*image2\.jpg$/);
    }

    async assertRelatedProductsVisible():Promise<void>{
        const relatedSection = this.page.locator("text=Related products");
        await expect(relatedSection).toBeVisible();
        await expect(this.page.locator('.card-title').first()).toBeVisible();
    }   
}
