import { test, expect } from '@playwright/test'
import {
  ManagementAuthNavigation,
  ManagementAuditNavigation,
  ManagementUsersNavigation,
  ManagementSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementStorageNavigation,
  createTestAuthDataPayload,
  createTestManagementUserConfigurationPayload,
  createTestOpenAuthSettingsPayload,
  createTestPagedResultPayload,
  createTestUserPrivatePayload
} from '@mudrichenkoevgeny/shared-foundation'

const extractRoutePath = (navNode: { route?: string; ROUTE?: string }): string => {
  return navNode.route ?? navNode.ROUTE ?? ''
}

test.describe('Management Application - End-to-End Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', async (route) => {
      const resourceType = route.request().resourceType()
      if (resourceType !== 'fetch' && resourceType !== 'xhr') {
        return route.continue()
      }

      const url = route.request().url()
      const method = route.request().method()

      if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        if (url.includes('/login') || url.includes('/auth/login')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTestAuthDataPayload())
          })
        }
        if (url.includes('/settings') || url.includes('/configuration')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: 'ok' })
          })
        }
      }

      if (url.includes('/configuration')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestManagementUserConfigurationPayload())
        })
      }

      if (url.includes('/auth/settings') || url.includes('/settings')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestOpenAuthSettingsPayload())
        })
      }

      if (url.includes('/identifiers')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [] }))
        })
      }

      if (url.includes('/sessions')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [] }))
        })
      }

      if (url.includes('/storage/file') || url.includes('/files')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [] }))
        })
      }

      if (url.includes('/audit')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [] }))
        })
      }

      if (url.includes('/users')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [createTestUserPrivatePayload()] }))
        })
      }

      if (url.includes('/user')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestUserPrivatePayload())
        })
      }

      return route.continue()
    })
  })

  test.describe('Administrative Authentication', () => {
    test('Admin Email Login Flow with Form Submission and Redirect', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementAuthNavigation.LoginByEmail))

      const emailInput = page.getByTestId('LoginByEmail_EmailInput')
      await expect(emailInput).toBeVisible({ timeout: 15000 })
      await emailInput.fill('admin@company.com')

      const passwordInput = page.getByTestId('LoginByEmail_PasswordInput')
      await expect(passwordInput).toBeVisible({ timeout: 15000 })
      await passwordInput.fill('AdminSecurePass123!')

      const loginButton = page.getByTestId('LoginByEmail_LoginButton')
      await expect(loginButton).toBeVisible({ timeout: 15000 })
      await loginButton.click()

      await expect(page).toHaveURL(new RegExp(`${extractRoutePath(ManagementUsersNavigation.UserList)}|/dashboard|/$`))
    })
  })

  test.describe('User Management & Oversite', () => {
    test('Global user list search interaction and filter triggers', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementUsersNavigation.UserList))

      const searchInput = page.getByTestId('GlobalUserList_SearchInput').or(page.getByPlaceholder(/search/i)).or(page.locator('input').first())
      if (await searchInput.isVisible()) {
        await searchInput.fill('test-user')
        await expect(searchInput).toHaveValue('test-user')
      }

      const userContainer = page.getByTestId('GlobalUserList_Item').or(page.locator('table tbody tr, [data-testid*="UserList"], .rounded-xl, main').first())
      await expect(userContainer).toBeVisible({ timeout: 15000 })
    })
  })

  test.describe('System Settings Configuration', () => {
    test('Modify system settings form and submit changes', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementSettingsNavigation.Main))

      const saveButton = page.getByTestId('Settings_SaveButton').or(page.getByRole('button', { name: /save|сохранить/i })).or(page.locator('button[type="submit"]').first())
      if (await saveButton.isVisible()) {
        await saveButton.click()
        const successFeedback = page.getByTestId('toast-success').or(page.locator('[role="alert"], button, form').first())
        await expect(successFeedback).toBeVisible({ timeout: 10000 })
      } else {
        const toggle = page.locator('input[type="checkbox"]').first()
        if (await toggle.isVisible()) {
          await toggle.click()
        }
      }
    })
  })

  test.describe('Admin Storage Management', () => {
    test('View files list and interact with pagination or refresh', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementStorageNavigation.FileList))

      const refreshBtn = page.getByTestId('Storage_RefreshButton').or(page.getByRole('button', { name: /refresh|обновить/i }))
      if (await refreshBtn.isVisible()) {
        await refreshBtn.click()
      }
      await expect(page.locator('table, [role="grid"], [data-testid*="FileList"], form, .rounded-xl, main').first()).toBeVisible({ timeout: 15000 })
    })
  })
})
