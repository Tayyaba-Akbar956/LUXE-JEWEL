import { test, expect } from '@playwright/test';

test.describe('LuxeJewel E-commerce Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage with hero section', async ({ page }) => {
    // Expect the page to have the correct title
    await expect(page).toHaveTitle(/LuxeJewel/);

    // Check for hero section elements
    await expect(page.locator('h1:has-text("Elevate Your Style")')).toBeVisible();
    await expect(page.locator('p:has-text("Discover our exclusive collection")')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    // Click on the "Shop Collection" button
    await page.locator('text=Shop Collection').click();

    // Expect to be on the products page
    await expect(page).toHaveURL(/.*\/products/);
    await expect(page.locator('h1:has-text("All Jewelry")')).toBeVisible();
  });

  test('should display product listing', async ({ page }) => {
    await page.goto('/products');

    // Check that products are displayed
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    // At least one product should be visible
    await expect(productCards).toHaveCount({ min: 1 });
  });

  test('should add product to cart', async ({ page }) => {
    // Go to a specific product page
    await page.goto('/products/gilded-solitaire-crystal-ring');

    // Add to cart
    await page.locator('button:has-text("Add to Cart")').click();

    // Check that the cart icon shows updated count
    const cartIcon = page.locator('[data-testid="cart-icon"]');
    await expect(cartIcon).toContainText('1');
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');

    // Click on the "Rings" category filter
    await page.locator('button:has-text("Rings")').click();

    // Check that only ring products are displayed
    const rings = page.locator('text=/ring/i');
    await expect(rings.first()).toBeVisible();
  });

  test('should sort products', async ({ page }) => {
    await page.goto('/products');

    // Sort by price low to high
    await page.locator('select').selectOption('price-low');

    // Get prices of first few products
    const prices = await page.locator('.product-price').allInnerTexts();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    
    // Check that prices are in ascending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  });

  test('should search for products', async ({ page }) => {
    // Use the search bar to search for a product
    await page.locator('[placeholder="Search jewelry..."]').fill('ring');
    await page.locator('[placeholder="Search jewelry..."]').press('Enter');

    // Check that search results are displayed
    const searchResults = page.locator('[data-testid="product-card"]');
    await expect(searchResults.first()).toBeVisible();
  });

  test('should add product to wishlist', async ({ page }) => {
    await page.goto('/products/gilded-solitaire-crystal-ring');

    // Click the wishlist button
    const wishlistButton = page.locator('button[aria-label="Add to wishlist"]');
    await wishlistButton.click();

    // Check that the button changes to indicate it's in the wishlist
    await expect(wishlistButton).toHaveClass(/bg-gold-500/);
  });
});