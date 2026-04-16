import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Expect hero CTA and featured products sections to render.
    await expect(page.locator('text=Shop Now').first()).toBeVisible()
    await expect(page.locator('text=Featured Products').first()).toBeVisible()
  })

  test('should expose product navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // The layout includes a header and link to shop
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('header a[href="/shop"]').first()).toBeVisible()
  })

  test('should display homepage marketing content', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('text=Ready for immediate dispatch').first()).toBeVisible()
    await expect(page.locator('text=Featured Products').first()).toBeVisible()
  })
})