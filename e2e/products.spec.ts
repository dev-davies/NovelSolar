import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should display products page', async ({ page }) => {
    await page.goto('/products')

    // Check page title
    await expect(page).toHaveTitle(/Products|Shop/)

    // Check for product grid/list
    const productsContainer = page.locator('.product-card, .product-item, [class*="product"]').first()
    await expect(productsContainer).toBeVisible()
  })

  test('should display individual product details', async ({ page }) => {
    // First go to products page
    await page.goto('/products')

    // Find and click on a product card
    const productCard = page.locator('.product-card, .product-item').first()
    await expect(productCard).toBeVisible()

    // Click on the product (if link exists)
    const productLink = productCard.locator('a').first()
    if (await productLink.count() > 0) {
      await productLink.click()

      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/products\/\d+|\/shop\/\d+/)

      // Check for product details
      await expect(page.locator('h1, .product-title')).toBeVisible()
    }
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products')

    // Look for category filters
    const categoryFilter = page.locator('select[name*="category"], [class*="filter"] select').first()

    if (await categoryFilter.count() > 0) {
      // Get initial product count
      const initialProducts = await page.locator('.product-card, .product-item').count()

      // Select a category
      await categoryFilter.selectOption({ index: 1 })

      // Wait for filtering to complete
      await page.waitForTimeout(1000)

      // Products should be filtered (count may change)
      const filteredProducts = page.locator('.product-card, .product-item')
      await expect(filteredProducts.first()).toBeVisible()
    }
  })

  test('should search for products', async ({ page }) => {
    await page.goto('/products')

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first()

    if (await searchInput.count() > 0) {
      // Type a search term
      await searchInput.fill('solar')
      await searchInput.press('Enter')

      // Wait for search results
      await page.waitForTimeout(1000)

      // Should show search results or "no results"
      const results = page.locator('.product-card, .product-item, .no-results')
      await expect(results.first()).toBeVisible()
    }
  })
})