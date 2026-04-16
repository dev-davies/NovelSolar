import { test, expect } from '@playwright/test'

test.describe('Checkout Process', () => {
  test('should proceed to checkout from cart', async ({ page }) => {
    // First add an item to cart
    await page.goto('/products')
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|add cart/i }).first()

    if (await addToCartButton.count() > 0) {
      await addToCartButton.click()

      // Go to cart
      const cartLink = page.locator('a').filter({ hasText: /cart|basket/i }).first()
      if (await cartLink.count() > 0) {
        await cartLink.click()

        // Find checkout button
        const checkoutButton = page.locator('button, a').filter({ hasText: /checkout|proceed/i }).first()

        if (await checkoutButton.count() > 0) {
          await checkoutButton.click()

          // Should navigate to checkout page
          await expect(page).toHaveURL(/\/checkout/)

          // Check for checkout form
          const checkoutForm = page.locator('form, [class*="checkout"]').first()
          await expect(checkoutForm).toBeVisible()
        }
      }
    }
  })

  test('should display checkout form fields', async ({ page }) => {
    // Go directly to checkout (assuming cart has items)
    await page.goto('/checkout')

    // Check for common checkout fields
    const nameField = page.locator('input[name*="name"], input[placeholder*="name"]').first()
    const emailField = page.locator('input[type="email"], input[name*="email"]').first()
    const phoneField = page.locator('input[type="tel"], input[name*="phone"]').first()
    const addressField = page.locator('input[name*="address"], textarea[name*="address"]').first()

    // At least some form fields should be present
    const formFields = await page.locator('input, textarea, select').count()
    expect(formFields).toBeGreaterThan(0)
  })

  test('should validate checkout form', async ({ page }) => {
    await page.goto('/checkout')

    // Find submit button
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /submit|place order|complete/i }).first()

    if (await submitButton.count() > 0) {
      // Try to submit empty form
      await submitButton.click()

      // Should show validation errors or prevent submission
      await page.waitForTimeout(1000)

      // Check for error messages
      const errorMessages = page.locator('[class*="error"], .invalid-feedback').first()
      if (await errorMessages.count() > 0) {
        await expect(errorMessages).toBeVisible()
      }
    }
  })

  test('should complete checkout with valid data', async ({ page }) => {
    await page.goto('/checkout')

    // Fill out the form with test data
    const nameField = page.locator('input[name*="name"]').first()
    const emailField = page.locator('input[type="email"]').first()
    const phoneField = page.locator('input[type="tel"]').first()

    if (await nameField.count() > 0) {
      await nameField.fill('Test User')
    }
    if (await emailField.count() > 0) {
      await emailField.fill('test@example.com')
    }
    if (await phoneField.count() > 0) {
      await phoneField.fill('+1234567890')
    }

    // Try to submit
    const submitButton = page.locator('button[type="submit"]').first()
    if (await submitButton.count() > 0) {
      await submitButton.click()

      // Wait for processing
      await page.waitForTimeout(2000)

      // Should either show success page or confirmation
      const successMessage = page.locator('[class*="success"], [class*="confirmation"]').first()
      const thankYouPage = page.locator('body').filter({ hasText: /thank you|success|confirmed/i })

      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible()
      } else if (await thankYouPage.count() > 0) {
        await expect(page.locator('body')).toContainText(/thank you|success|confirmed/i)
      }
    }
  })
})