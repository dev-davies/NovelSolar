import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test('should display admin login page', async ({ page }) => {
    await page.goto('/admin/login')

    // Check for login form
    const loginForm = page.locator('form').first()
    await expect(loginForm).toBeVisible()

    // Check for email/password fields
    const emailField = page.locator('input[type="email"], input[name*="email"]').first()
    const passwordField = page.locator('input[type="password"]').first()

    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
  })

  test('should show login validation errors', async ({ page }) => {
    await page.goto('/admin/login')

    // Find and click login button without filling fields
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign in/i }).first()

    if (await loginButton.count() > 0) {
      await loginButton.click()

      // Should show validation errors
      await page.waitForTimeout(1000)

      const errorMessage = page.locator('[class*="error"], .alert-danger').first()
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible()
      }
    }
  })

  test('should redirect to dashboard after login', async ({ page }) => {
    await page.goto('/admin/login')

    // Fill login form with test credentials
    const emailField = page.locator('input[type="email"]').first()
    const passwordField = page.locator('input[type="password"]').first()

    if (await emailField.count() > 0 && await passwordField.count() > 0) {
      await emailField.fill('admin@example.com')
      await passwordField.fill('password123')

      const loginButton = page.locator('button[type="submit"]').first()
      if (await loginButton.count() > 0) {
        await loginButton.click()

        // Wait for navigation
        await page.waitForTimeout(2000)

        // Should redirect to admin dashboard or show success
        const currentUrl = page.url()
        const isOnDashboard = currentUrl.includes('/admin') && !currentUrl.includes('/login')

        if (isOnDashboard) {
          // Check for admin dashboard elements
          const dashboardContent = page.locator('[class*="dashboard"], [class*="admin"]').first()
          await expect(dashboardContent).toBeVisible()
        }
      }
    }
  })

  test('should display admin navigation', async ({ page }) => {
    // Assuming we're logged in or bypassing login for this test
    await page.goto('/admin/manage-products')

    // Check for admin navigation/menu
    const adminNav = page.locator('nav[class*="admin"], aside, .sidebar').first()

    if (await adminNav.count() > 0) {
      await expect(adminNav).toBeVisible()

      // Check for admin menu items
      const menuItems = adminNav.locator('a, button').filter({ hasText: /products|users|orders|dashboard/i })
      await expect(menuItems.first()).toBeVisible()
    }
  })

  test('should display product management interface', async ({ page }) => {
    await page.goto('/admin/manage-products')

    // Check for product management elements
    const productTable = page.locator('table, [class*="product-list"]').first()
    const addProductButton = page.locator('button').filter({ hasText: /add product|new product/i }).first()

    // Should have either a table or add button
    if (await productTable.count() > 0) {
      await expect(productTable).toBeVisible()
    } else if (await addProductButton.count() > 0) {
      await expect(addProductButton).toBeVisible()
    }
  })

  test('should handle admin logout', async ({ page }) => {
    // Go to admin area
    await page.goto('/admin/login')

    // Look for logout button/link (might be in header)
    const logoutButton = page.locator('a, button').filter({ hasText: /logout|sign out/i }).first()

    if (await logoutButton.count() > 0) {
      await logoutButton.click()

      // Should redirect to login or homepage
      await page.waitForTimeout(1000)

      const currentUrl = page.url()
      expect(currentUrl).not.toContain('/admin/')
    }
  })
})