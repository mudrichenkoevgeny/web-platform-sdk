import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { AppType, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailScreen, LoginByEmailTestTags } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.post('https://api.example.com/auth/login/email', async () => {
    return HttpResponse.json(createTestAuthDataPayload())
  })
)

describe('ClientUser Feature Cross-Layer Integration (UI + Store + UseCase + Repository + MSW)', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should execute end-to-end login flow through all layers to network interception', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })

    const clientUserComponent = clientUserComponentMock({
      commonComponent
    })

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

    // User interacts with UI DOM elements
    const emailInput = screen.getByTestId(LoginByEmailTestTags.EMAIL_INPUT)
    const passwordInput = screen.getByTestId(LoginByEmailTestTags.PASSWORD_INPUT)
    const submitButton = screen.getByTestId(LoginByEmailTestTags.LOGIN_BUTTON)

    fireEvent.change(emailInput, { target: { value: 'integration@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } })
    fireEvent.click(submitButton)

    // Assert that the full cross-layer flow finishes successfully
    await waitFor(() => {
      expect(onFinishedMock).toHaveBeenCalled()
    })
  })
})
