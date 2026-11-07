import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { AppType, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  LoginByEmailScreen,
  LoginByEmailTestTags,
  LoginByTotpScreen,
  PendingDeletionScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.post('https://api.example.com/auth/login/email', async () => {
    return HttpResponse.json(createTestAuthDataPayload())
  }),
  http.post('https://api.example.com/auth/login/totp', async () => {
    return HttpResponse.json(createTestAuthDataPayload())
  })
)

describe('Client User Login Flows Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Login by Email - Complete email and password authentication flow', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })
    const onFinishedMock = vi.fn()

    render(
      <LoginByEmailScreen
        dependencies={{
          appType: AppType.CLIENT,
          loginByEmailUseCase: clientUserComponent.loginByEmailUseCase,
          onNavigateToRegistrationByEmail: vi.fn(),
          onNavigateToForgotPassword: vi.fn(),
          onNavigateToTotp: vi.fn(),
          onNavigateToPendingDeletion: vi.fn(),
          onNavigateToAccountUnlock: vi.fn(),
          onBack: vi.fn(),
          onFinished: onFinishedMock
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(LoginByEmailTestTags.TITLE)).toBeDefined()
    })

    const emailInput = screen.getByTestId(LoginByEmailTestTags.EMAIL_INPUT)
    const passwordInput = screen.getByTestId(LoginByEmailTestTags.PASSWORD_INPUT)
    const loginButton = screen.getByTestId(LoginByEmailTestTags.LOGIN_BUTTON)

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(onFinishedMock).toHaveBeenCalled()
    })
  })

  it('Flow 2: Login by TOTP - MFA Verification step screen rendering', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <LoginByTotpScreen
        dependencies={{
          mfaToken: 'mock-mfa-token',
          loginByTotpUseCase: clientUserComponent.loginByTotpUseCase,
          loginByTotpRecoveryCodeUseCase: clientUserComponent.loginByTotpRecoveryCodeUseCase,
          onBack: vi.fn(),
          onFinished: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeDefined()
    })
  })

  it('Flow 3: Pending Deletion Screen - Account deletion cancellation screen rendering', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <PendingDeletionScreen
        dependencies={{
          restoreUserUseCase: clientUserComponent.restoreUserUseCase,
          onBack: vi.fn(),
          onFinished: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /restore account/i })).toBeDefined()
    })
  })
})
