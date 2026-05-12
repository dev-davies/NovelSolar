import { test, expect, type Page } from '@playwright/test'

/**
 * Real-handler coverage for the admin mutation endpoints that are otherwise
 * untested: create-admin, delete-admin, change-password.
 *
 * Requires a master admin in the target Supabase project. Provide:
 *   E2E_MASTER_ADMIN_EMAIL    - login email for a master admin
 *   E2E_MASTER_ADMIN_PASSWORD - that admin's password
 * Tests are skipped (not failed) if either is missing, so CI without the
 * secrets doesn't block.
 */
const masterEmail = process.env.E2E_MASTER_ADMIN_EMAIL
const masterPassword = process.env.E2E_MASTER_ADMIN_PASSWORD
const hasCreds = Boolean(masterEmail && masterPassword)

async function loginAsMaster(page: Page) {
  await page.goto('/admin/login')
  await page.locator('input[type="email"]').first().fill(masterEmail!)
  await page.locator('input[type="password"]').first().fill(masterPassword!)
  await page.locator('button[type="submit"]').first().click()
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15_000 })
}

test.describe('Admin mutation endpoints', () => {
  test.skip(!hasCreds, 'Set E2E_MASTER_ADMIN_EMAIL and E2E_MASTER_ADMIN_PASSWORD to run')

  test.describe.configure({ mode: 'serial' })

  let createdUsername: string

  test('create-admin: master can create a new admin and receive a temp password', async ({ page }) => {
    await loginAsMaster(page)
    await page.goto('/admin/manage-admins')

    const suffix = Date.now().toString(36)
    createdUsername = `e2e_admin_${suffix}`
    const newEmail = `e2e+${suffix}@novelsolar.test`

    await page.locator('input[placeholder="admin@example.com"]').fill(newEmail)
    await page.locator('input[placeholder="john_admin"]').fill(createdUsername)

    const createResponse = page.waitForResponse(
      (r) => r.url().endsWith('/api/admin/create-admin') && r.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /create admin/i }).click()
    const response = await createResponse

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.temporaryPassword).toMatch(/^Admin-[a-f0-9]{8}!$/)

    // The new row should appear in the admin list
    await expect(page.getByText(createdUsername)).toBeVisible({ timeout: 10_000 })
  })

  test('create-admin: rejects duplicate username with 409', async ({ page }) => {
    test.skip(!createdUsername, 'Depends on the previous test having created an admin')
    await loginAsMaster(page)
    await page.goto('/admin/manage-admins')

    // Use a fresh email but reuse the just-created username
    const duplicateAttempt = `e2e-dup+${Date.now().toString(36)}@novelsolar.test`
    await page.locator('input[placeholder="admin@example.com"]').fill(duplicateAttempt)
    await page.locator('input[placeholder="john_admin"]').fill(createdUsername)

    const dupResponse = page.waitForResponse(
      (r) => r.url().endsWith('/api/admin/create-admin') && r.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /create admin/i }).click()
    const response = await dupResponse
    expect(response.status()).toBe(409)
  })

  test('delete-admin: master can remove the admin created above', async ({ page }) => {
    test.skip(!createdUsername, 'Nothing to delete')
    await loginAsMaster(page)
    await page.goto('/admin/manage-admins')

    const row = page.locator('div', { hasText: createdUsername }).first()
    await expect(row).toBeVisible()
    await row.getByRole('button', { name: /^Remove$/i }).click()

    const deleteResponse = page.waitForResponse(
      (r) => r.url().endsWith('/api/admin/delete-admin') && r.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /yes, remove/i }).click()
    const response = await deleteResponse
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)

    await expect(page.getByText(createdUsername)).toHaveCount(0, { timeout: 10_000 })
  })

  test('delete-admin: master cannot remove their own account', async ({ page, request }) => {
    await loginAsMaster(page)
    // Hit the API directly to confirm the self-delete guard
    const meResponse = await page.request.get('/api/admin/me')
    expect(meResponse.ok()).toBeTruthy()
    const me = await meResponse.json()
    const selfId = me?.admin?.user_id || me?.user_id
    expect(selfId).toBeTruthy()

    const res = await page.request.post('/api/admin/delete-admin', {
      data: { target_user_id: selfId }
    })
    expect(res.status()).toBe(400)
  })

  test('change-password: rejects when current password is wrong', async ({ page }) => {
    await loginAsMaster(page)
    await page.goto('/admin/change-password')

    await page.locator('input[autocomplete="current-password"]').fill('this-is-definitely-not-the-password')
    await page.locator('input[autocomplete="new-password"]').first().fill('NewStrongPass123!')
    await page.locator('input[autocomplete="new-password"]').nth(1).fill('NewStrongPass123!')

    const response = page.waitForResponse(
      (r) => r.url().endsWith('/api/admin/change-password') && r.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /update password|change password/i }).click()
    const res = await response
    expect(res.status()).toBe(401)
  })

  test('change-password: rejects when new password is too short', async ({ page }) => {
    await loginAsMaster(page)
    // Bypass the UI's client-side min-length check by calling the API directly
    const res = await page.request.post('/api/admin/change-password', {
      data: { current_password: masterPassword, new_password: 'short' }
    })
    expect(res.status()).toBe(400)
  })

  test('change-password: succeeds with correct current password and rolls back', async ({ page }) => {
    const rotated = `Rotated-${Date.now().toString(36)}-A1!`
    await loginAsMaster(page)

    const forwardRes = await page.request.post('/api/admin/change-password', {
      data: { current_password: masterPassword, new_password: rotated }
    })
    expect(forwardRes.status()).toBe(200)

    // Roll back so the suite is idempotent
    const rollbackRes = await page.request.post('/api/admin/change-password', {
      data: { current_password: rotated, new_password: masterPassword }
    })
    expect(rollbackRes.status()).toBe(200)
  })
})

test.describe('Admin mutation endpoints — unauthenticated', () => {
  test('create-admin without session returns 401/403', async ({ request }) => {
    const res = await request.post('/api/admin/create-admin', {
      data: { admin_email: 'x@y.co', admin_username: 'x' }
    })
    expect([401, 403]).toContain(res.status())
  })

  test('delete-admin without session returns 401/403', async ({ request }) => {
    const res = await request.post('/api/admin/delete-admin', {
      data: { target_user_id: '00000000-0000-0000-0000-000000000000' }
    })
    expect([401, 403]).toContain(res.status())
  })

  test('change-password without session returns 401/403', async ({ request }) => {
    const res = await request.post('/api/admin/change-password', {
      data: { current_password: 'a', new_password: 'longenoughpassword' }
    })
    expect([401, 403]).toContain(res.status())
  })
})
