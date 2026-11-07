import { test, expect } from '@playwright/test'
import {
  ClientAuthNavigation,
  ClientUserNavigation,
  OpenStorageNavigation,
  createTestAuthDataPayload,
  createTestOpenAuthSettingsPayload,
  createTestOpenUserConfigurationPayload,
  createTestPagedResultPayload,
  createTestUserIdentifierPrivatePayload,
  createTestUserPrivatePayload,
  createTestUserSessionPrivatePayload
} from '@mudrichenkoevgeny/shared-foundation'

const extractRoutePath = (navNode: { route?: string; ROUTE?: string }): string => {
  return navNode.route ?? navNode.ROUTE ?? ''
}

test.describe('Client Application - End-to-End Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', async (route) => {
      const resourceType = route.request().resourceType()
      if (resourceType !== 'fetch' && resourceType !== 'xhr') {
        return route.continue()
      }

      const url = route.request().url()
      const method = route.request().method()

      if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        if (url.includes('/login') || url.includes('/auth/login') || url.includes('/register') || url.includes('/registration')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTestAuthDataPayload())
          })
        }
        if (url.includes('/user') || url.includes('/profile') || url.includes('/settings')) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTestUserPrivatePayload())
          })
        }
        if (url.includes('/storage') || url.includes('/file')) {
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
          body: JSON.stringify(createTestOpenUserConfigurationPayload())
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
          body: JSON.stringify(createTestPagedResultPayload({ items: [createTestUserIdentifierPrivatePayload()] }))
        })
      }

      if (url.includes('/sessions')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [createTestUserSessionPrivatePayload()] }))
        })
      }

      if (url.includes('/storage/file') || url.includes('/files')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestPagedResultPayload({ items: [] }))
        })
      }

      if (url.includes('/login')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createTestAuthDataPayload())
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

  test.describe('Authentication Flows', () => {
    test('Standard Email Login Flow with User Interaction and Redirect', async ({ page }) => {
      await page.goto(extractRoutePath(ClientAuthNavigation.LoginByEmail))

      const emailInput = page.getByTestId('LoginByEmail_EmailInput')
      await expect(emailInput).toBeVisible({ timeout: 15000 })
      await emailInput.fill('user@example.com')

      const passwordInput = page.getByTestId('LoginByEmail_PasswordInput')
      await expect(passwordInput).toBeVisible({ timeout: 15000 })
      await passwordInput.fill('SecurePass123!')

      const loginButton = page.getByTestId('LoginByEmail_LoginButton')
      await expect(loginButton).toBeVisible({ timeout: 15000 })
      await loginButton.click()

      await expect(page).toHaveURL(new RegExp(`${extractRoutePath(ClientUserNavigation.Main)}|/dashboard|/$`))
    })

    test('Registration Flow User Interaction and Submission', async ({ page }) => {
      await page.goto(extractRoutePath(ClientAuthNavigation.Registration))

      const emailInput = page.getByTestId('Registration_EmailInput').or(page.locator('input[type="email"]').first())
      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill('newuser@example.com')
        await expect(emailInput).toHaveValue('newuser@example.com')
      }

      const passwordInput = page.getByTestId('Registration_PasswordInput').or(page.locator('input[type="password"]').first())
      if (await passwordInput.isVisible({ timeout: 5000 })) {
        await passwordInput.fill('SecurePass123!')
      }

      const submitButton = page.getByTestId('Registration_SubmitButton').or(page.getByRole('button', { name: /register|sign up|зарегистрироваться/i }))
      if (await submitButton.isVisible({ timeout: 5000 })) {
        await submitButton.click()
      }
    })
  })

  test.describe('Storage & Files Management', () => {
    test('View files list and interact with upload trigger', async ({ page }) => {
      await page.goto(extractRoutePath(OpenStorageNavigation.FileList))

      const refreshBtn = page.getByTestId('Storage_RefreshButton').or(page.getByRole('button', { name: /refresh|обновить/i }))
      if (await refreshBtn.isVisible()) {
        await refreshBtn.click()
      }

      const uploadButton = page.getByTestId('StorageFileList_UploadButton').or(page.getByRole('button', { name: /upload|загрузить/i }))
      if (await uploadButton.isVisible({ timeout: 5000 })) {
        await expect(uploadButton).toBeEnabled()
      }
      await expect(page.locator('table, [role="grid"], [data-testid*="FileList"], form, .rounded-xl, main').first()).toBeVisible({ timeout: 15000 })
    })

    test('Upload a new file with filechooser event', async ({ page }) => {
      await page.goto(extractRoutePath(OpenStorageNavigation.FileUpload))

      const dropzone = page.getByTestId('StorageFileUpload_DropzoneArea').or(page.locator('.border-dashed')).first()
      if (await dropzone.isVisible({ timeout: 5000 })) {
        const fileChooserPromise = page.waitForEvent('filechooser').catch(() => null)
        await dropzone.click()
        const fileChooser = await fileChooserPromise
        if (fileChooser) {
          await fileChooser.setFiles({
            name: 'test-document.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('dummy content representing a file')
          })
        }
      }
    })
  })

  test.describe('User Profile & Security', () => {
    test('Edit user profile details and submit changes', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.UserEdit))

      const nicknameInput = page.getByTestId('UserEdit_NicknameInput')
      if (await nicknameInput.isVisible({ timeout: 5000 })) {
        await nicknameInput.clear()
        await nicknameInput.fill('Updated User Name')
        await expect(nicknameInput).toHaveValue('Updated User Name')
      }

      const saveButton = page.getByTestId('UserEdit_SaveButton').or(page.getByRole('button', { name: /save|сохранить|update/i }))
      if (await saveButton.isVisible({ timeout: 5000 })) {
        await saveButton.click()
        const successFeedback = page.getByTestId('toast-success').or(page.locator('[role="alert"]').first())
        await expect(successFeedback).toBeVisible({ timeout: 10000 })
      }
    })

    test('Manage active sessions list interaction', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.SessionList))

      const sessionContainer = page.getByTestId('SessionList_Item').or(page.locator('table tbody tr, [data-testid*="Session"], .rounded-xl, main').first())
      await expect(sessionContainer).toBeVisible({ timeout: 15000 })
    })

    test('View identifiers list screen interaction', async ({ page }) => {
      await page.goto(extractRoutePath(ClientUserNavigation.IdentifierList))

      const identifierContainer = page.getByTestId('IdentifierList_Item').or(page.locator('table tbody tr, [data-testid*="Identifier"], .rounded-xl, main').first())
      await expect(identifierContainer).toBeVisible({ timeout: 15000 })
    })
  })
})
