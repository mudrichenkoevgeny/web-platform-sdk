import { test, expect } from '@playwright/test'
import {
  ManagementAuthNavigation,
  ManagementAuditNavigation,
  ManagementUsersNavigation,
  ManagementSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'

const extractRoutePath = (navNode: { route?: string; ROUTE?: string }): string => {
  return navNode.route ?? navNode.ROUTE ?? ''
}

test.describe('Management Application - End-to-End Test Suite', () => {

  test.describe('Administrative Authentication', () => {
    test('Admin Email Login Flow', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementAuthNavigation.LoginByEmail))

      await page.getByTestId('admin-email-input').fill('admin@company.com')
      await page.getByTestId('admin-password-input').fill('AdminSecurePass123!')
      await page.getByTestId('submit-admin-login').click()

      await expect(page).toHaveURL(/\/$/)
      await expect(page.getByTestId('admin-dashboard-layout')).toBeVisible()
    })
  })

  test.describe('User Management & Oversite', () => {
    test('Search and filter users list', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementUsersNavigation.UserList))

      const searchInput = page.getByTestId('search-users-input')
      await searchInput.fill('john.doe')
      await page.getByTestId('search-submit-button').click()

      await expect(page).toHaveURL(/search=john\.doe/)
      await expect(page.getByTestId('users-data-table')).toBeVisible()
    })

    test('View user details and navigate to sub-resources', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementUsersNavigation.UserList))

      const viewDetailsButtons = page.getByTestId('view-user-details-action')
      if (await viewDetailsButtons.count() > 0) {
        await viewDetailsButtons.first().click()
        await expect(page).toHaveURL(/\/users\/[0-9a-fA-F-]+/i)

        await page.getByTestId('nav-tab-identifiers').click()
        await expect(page.getByTestId('user-identifiers-list')).toBeVisible()
      }
    })
  })

  test.describe('Audit Logs & Monitoring', () => {
    test('Filter audit events by action type', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementAuditNavigation.AuditEventList))

      await page.getByTestId('open-filters-button').click()
      await page.getByTestId('filter-action-type-select').selectOption('USER_LOGIN')
      await page.getByTestId('apply-filters-button').click()

      await expect(page).toHaveURL(/actionType=USER_LOGIN/)
      await expect(page.getByTestId('audit-events-data-table')).toBeVisible()
    })
  })

  test.describe('System Settings Configuration', () => {
    test('Modify global system configuration', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementSettingsNavigation.Main))

      const maintenanceToggle = page.getByTestId('toggle-maintenance-mode')
      await maintenanceToggle.click()

      await page.getByTestId('save-global-settings-button').click()
      await expect(page.getByTestId('toast-success')).toBeVisible()
    })

    test('Modify security configuration (Password Policies)', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementSecurityNavigation.SecuritySettings))

      const minLengthInput = page.getByTestId('input-password-min-length')
      await minLengthInput.clear()
      await minLengthInput.fill('12')

      await page.getByTestId('save-security-settings-button').click()
      await expect(page.getByTestId('toast-success')).toBeVisible()
    })
  })

  test.describe('Admin Storage Management', () => {
    test('View all files and trigger batch delete', async ({ page }) => {
      await page.goto(extractRoutePath(ManagementStorageNavigation.FileList))

      await expect(page.getByTestId('admin-files-data-table')).toBeVisible()

      const rowCheckboxes = page.getByTestId('select-file-checkbox')
      if (await rowCheckboxes.count() > 1) {
        await rowCheckboxes.nth(0).check()
        await rowCheckboxes.nth(1).check()

        await page.getByTestId('batch-delete-files-button').click()
        await page.getByTestId('confirm-dialog-submit').click()

        await expect(page.getByTestId('toast-success')).toBeVisible()
      }
    })
  })
})
