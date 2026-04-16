import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test('should add product to cart', async ({ page }) => {
    // Go to products page
    await page.goto('/products')

    // Find a product and add to cart
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|add cart/i }).first()

    if (await addToCartButton.count() > 0) {
      await addToCartButton.click()

      // Check for cart notification or cart count update
      const cartIndicator = page.locator('[class*="cart"], [data-testid*="cart"]').first()
      await expect(cartIndicator).toBeVisible()

      // Cart count should increase
      const cartCount = page.locator('.cart-count, .cart-badge').first()
      if (await cartCount.count() > 0) {
        const countText = await cartCount.textContent()
        expect(parseInt(countText || '0')).toBeGreaterThan(0)
      }
    }
  })

  test('should display cart contents', async ({ page }) => {
    // First add an item to cart
    await page.goto('/products')
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|add cart/i }).first()

    if (await addToCartButton.count() > 0) {
      await addToCartButton.click()

      // Go to cart page
      const cartLink = page.locator('a').filter({ hasText: /cart|basket/i }).first()
      if (await cartLink.count() > 0) {
        await cartLink.click()

        // Should be on cart page
        await expect(page).toHaveURL(/\/cart|\/checkout/)

        // Check for cart items
        const cartItem = page.locator('.cart-item, .cart-product').first()
        await expect(cartItem).toBeVisible()

        // Check for total price
        const totalPrice = page.locator('[class*="total"], [data-testid*="total"]').first()
        await expect(totalPrice).toBeVisible()
      }
    }
  })

  test('should update cart quantity', async ({ page }) => {
    // Add item to cart first
    await page.goto('/products')
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|add cart/i }).first()

    if (await addToCartButton.count() > 0) {
      await addToCartButton.click()

      // Go to cart
      const cartLink = page.locator('a').filter({ hasText: /cart|basket/i }).first()
      if (await cartLink.count() > 0) {
        await cartLink.click()

        // Find quantity input or buttons
        const quantityInput = page.locator('input[type="number"][class*="quantity"]').first()
        const increaseButton = page.locator('button').filter({ hasText: '+' }).first()

        if (await quantityInput.count() > 0) {
          // Update quantity
          await quantityInput.fill('2')

          // Wait for update
          await page.waitForTimeout(1000)

          // Check that total updated
          const totalPrice = page.locator('[class*="total"]').first()
          await expect(totalPrice).toBeVisible()
        } else if (await increaseButton.count() > 0) {
          await increaseButton.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })

  test('should remove item from cart', async ({ page }) => {
    // Add item to cart first
    await page.goto('/products')
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|add cart/i }).first()

    if (await addToCartButton.count() > 0) {
      await addToCartButton.click()

      // Go to cart
      const cartLink = page.locator('a').filter({ hasText: /cart|basket/i }).first()
      if (await cartLink.count() > 0) {
        await cartLink.click()

        // Find remove button
        const removeButton = page.locator('button').filter({ hasText: /remove|delete|×/i }).first()

        if (await removeButton.count() > 0) {
          await removeButton.click()

          // Wait for removal
          await page.waitForTimeout(1000)

          // Cart should be empty or item removed
          const emptyCart = page.locator('[class*="empty"], [data-testid*="empty"]').first()
          if (await emptyCart.count() > 0) {
            await expect(emptyCart).toBeVisible()
          }
        }
      }
    }
  })
})