import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { AppType, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  LoginByEmailScreen,
  LoginByTotpScreen,
  PendingDeletionScreen,
  LoginByEmailTestTags
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.post('https://api.example.com/open/v1/auth/login/email', () => {
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

    render(
      <LoginByEmailScreen
        dependencies={{
          appType: AppType.CLIENT,
          loginByEmailUseCase: clientUserComponent.loginByEmailUseCase,
          onNavigateToRegistrationByEmail: vi.fn(),
          onNavigateToForgotPassword: vi.fn(),
          onNavigateToTotp: vi.fn(),
          onNavigateToPendingDeletion: vi.fn(),
          onBack: vi.fn(),
          onFinished: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(LoginByEmailTestTags.EMAIL_INPUT)).toBeDefined()
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
          onNavigateToPendingDeletion: vi.fn(),
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
          logoutUseCase: clientUserComponent.logoutUseCase,
          onRestoreSuccess: vi.fn(),
          onSignOut: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /restore account/i })).toBeDefined()
    })
  })
})
