import { test, expect } from '@playwright/test'
import {
  ClientAuthNavigation,
  ClientUserNavigation,
  OpenStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'

const extractRoutePath = (navNode: { route?: string; ROUTE?: string }): string => {
  return navNode.route ?? navNode.ROUTE ?? ''
}

test.describe('Client Application - End-to-End Test Suite', () => {

  test.describe('Authentication Flows', () => {
    test('Standard Email Login Flow', async ({ page }) => {
      await page.goto(extractRoutePath(ClientAuthNavigation.LoginByEmail))

      await page.getByTestId('email-input').fill('user@example.com')
      await page.getByTestId('password-input').fill('SecurePass123!')
      await page.getByTestId('submit-login-button').click()

      await expect(page).toHaveURL(new RegExp(`${extractRoutePath(ClientUserNavigation.Main)}|/$`))
      await expect(page.getByTestId('user-dashboard-title')).toBeVisible({ timeout: 10000 })
    })

    test('Registration Flow', async ({ page }) => {
      await page.goto(extractRoutePath(ClientAuthNavigation.Registration))

      await page.getByTestId('register-email-input').fill('newuser@example.com')
      await page.getByTestId('register-password-input').fill('SecurePass123!')
      await page.getByTestId('submit-registration-button').click()

      await expect(page).toHaveURL(new RegExp(extractRoutePath(ClientAuthNavigation.Main)))
    })
  })

  test.describe('Storage & Files Management', () => {
    test('Upload a new file', async ({ page }) => {
      await page.goto(extractRoutePath(OpenStorageNavigation.FileUpload))

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByTestId('file-dropzone-area').click()
      const fileChooser = await fileChooserPromise

      await fileChooser.setFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('dummy content representing a file')
      })

      await page.getByTestId('upload-file-button').click()
      await expect(page.getByTestId('toast-success')).toBeVisible()
    })

    test('View and paginate files', async ({ page }) => {
      await page.goto(extractRoutePath(OpenStorageNavigation.FileList))
      await expect(page.getByTestId('files-data-table')).toBeVisible()

      const nextButton = page.getByTestId('pagination-next-button')
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        await nextButton.click()
        await expect(page).toHaveURL(/pageNumber=2/)
      }
    })
  })

  test.describe('User Profile & Security', () => {
    test('Edit user profile details', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.UserEdit))

      const nameInput = page.getByTestId('profile-name-input')
      await nameInput.clear()
      await nameInput.fill('Updated User Name')

      await page.getByTestId('save-profile-button').click()
      await expect(page.getByTestId('toast-success')).toBeVisible()
    })

    test('Manage active sessions', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.SessionList))
      await expect(page.getByTestId('sessions-list-container')).toBeVisible()

      const revokeButtons = page.getByTestId('revoke-session-button')
      if (await revokeButtons.count() > 0) {
        await revokeButtons.first().click()
        await page.getByTestId('confirm-dialog-submit').click()
        await expect(page.getByTestId('toast-success')).toBeVisible()
      }
    })

    test('View identifiers list', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.IdentifierList))
      await expect(page.getByTestId('identifiers-list-container')).toBeVisible()
      await expect(page.getByTestId('identifier-item').first()).toBeVisible()
    })
  })
})
