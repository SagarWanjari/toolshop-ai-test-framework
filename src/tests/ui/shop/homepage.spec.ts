import { test, expect } from '@fixtures/index'
import { HomePage } from '@pages/shop/HomePage';
import products from '@test-data/products.json';

test.describe( 'Homepage and product listing',()=>{

  test('homepage displays product on load @smoke', async ({homePage}) =>{
      await homePage.goto();
      await homePage.assertProductsVisible();
      await homePage.assertProductCountAtLeast(6);
  });

  test('search by keyword returns matching products @smoke', async ({homePage}) =>{
      await homePage.goto();    
      await homePage.searchFor(products[1]!.name); 
      await homePage.assertAllProductsContain(products[1]!.name);
  });

  test('search with no results shows empty state @regression', async ({homePage}) =>{
      await homePage.goto();
      await homePage.searchFor(products[3]!.name);
      await homePage.assertNoProductsFound();
  });

  test('filter by category narrows results @regression', async ({homePage}) =>{
      await homePage.goto();
      const totalBefore = await homePage.getProductCount();
      await homePage.filterByCategory(products[4]!.name);
      const totalAfter = await homePage.getProductCount();
      expect(totalAfter).toBeLessThan(totalBefore);
  });

  test('sort by price low to high orders products correctly @regression', async ({homePage}) =>{
      await homePage.goto();
      await homePage.sortBy('price,asc');
      await homePage.assertPricesInAscendingOrder();
  });

  test('sort by price high to low orders products correctly @regression', async ({homePage}) =>{
      await homePage.goto();
      await homePage.sortBy('price,desc');
      await homePage.assertPricesInDescendingOrder();
  });

  test('product card shows name price and image @regression', async ({homePage}) =>{
      await homePage.goto();
      await homePage.assertFirstProductHasNamePriceImage();
  });

})

