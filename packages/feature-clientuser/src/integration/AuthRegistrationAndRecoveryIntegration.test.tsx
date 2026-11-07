import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { AccountLockoutType, userStrings, createTestAuthDataPayload, createTestPagedResultPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ValidatePasswordUseCaseMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import {
  ResetEmailPasswordScreen,
  UnlockMethodSelectionScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.post('https://api.example.com/auth/registration/email', async () => {
    return HttpResponse.json(createTestAuthDataPayload())
  }),
  http.post('https://api.example.com/open/v1/auth/reset-password/email', async () => {
    return HttpResponse.json({ retry_after_seconds: 30, number_of_symbols: 6, expiration_seconds: 300 })
  }),
  http.get('https://api.example.com/user/identifiers', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [] }))
  })
)

describe('Client User Registration & Recovery Flows Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Registration by Email - Complete sign up flow via RegistrationByEmailUseCase', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    const result = await clientUserComponent.registrationByEmailUseCase.execute(
      'newuser@test.com',
      'ValidPass123!'
    )

    expect(isSuccess(result)).toBe(true)
  })

  it('Flow 2: Reset Email Password - Request reset link screen rendering', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <ResetEmailPasswordScreen
        dependencies={{
          resetPasswordRepository: clientUserComponent.resetPasswordRepository,
          sendResetPasswordConfirmationToEmailUseCase: clientUserComponent.sendResetPasswordConfirmationToEmailUseCase,
          resetEmailPasswordUseCase: clientUserComponent.resetEmailPasswordUseCase,
          validatePasswordUseCase: new ValidatePasswordUseCaseMock(false),
          onBack: vi.fn(),
          onFinished: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('ResetEmailPassword_EmailInput')).toBeDefined()
    })
  })

  it('Flow 3: Account Unlock Method Selection Flow', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <UnlockMethodSelectionScreen
        dependencies={{
          lockoutType: AccountLockoutType.TEMPORARY,
          getUserIdentifiersUseCase: clientUserComponent.getUserIdentifiersUseCase,
          unlockByGoogleUseCase: clientUserComponent.unlockByGoogleUseCase,
          onNavigateToEmailInput: vi.fn(),
          onNavigateToPhoneInput: vi.fn(),
          onUnlockSuccess: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(userStrings.ui.unlockChooseMethod)).toBeDefined()
    })
  })
})
