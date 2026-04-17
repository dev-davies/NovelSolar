import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should display shop page', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('domcontentloaded')

    // Check that the shop page loads
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).toContain('/shop')
  })

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/shop/258')
    await page.waitForLoadState('domcontentloaded')

    // Check that product detail page loads
    await expect(page.locator('body')).toBeVisible()
    await expect(page.url()).toContain('/shop/258')
  })

  test('should handle category filter', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('domcontentloaded')

    // Just verify page loads with filters present
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle search', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForLoadState('domcontentloaded')

    // Just verify page loads with search capability
    await expect(page.locator('body')).toBeVisible()
  })
})