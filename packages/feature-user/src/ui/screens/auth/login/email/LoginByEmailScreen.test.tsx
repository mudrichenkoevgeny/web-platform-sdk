import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen, LoginByEmailTestTags } from '@/ui/screens/auth/login/email/LoginByEmailScreen'
import type { LoginByEmailStoreDependencies } from '@/ui/screens/auth/login/email/login-by-email-store'

describe('LoginByEmailScreen', () => {
  const createMockDeps = (): LoginByEmailStoreDependencies => ({
    appType: AppType.CLIENT,
    loginByEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userDetails: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as unknown as LoginByEmailStoreDependencies['loginByEmailUseCase'],
    onNavigateToRegistrationByEmail: vi.fn(),
    onNavigateToForgotPassword: vi.fn(),
    onNavigateToTotp: vi.fn(),
    onNavigateToPendingDeletion: vi.fn(),
    onNavigateToAccountUnlock: vi.fn(),
    onBack: vi.fn(),
    onFinished: vi.fn()
  })

  it('enables login button when valid email and password are provided', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const loginButton = screen.getByTestId(LoginByEmailTestTags.LOGIN_BUTTON)
    expect(loginButton.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByTestId(LoginByEmailTestTags.EMAIL_INPUT)
    const passwordInput = screen.getByTestId(LoginByEmailTestTags.PASSWORD_INPUT)

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'secret123')

    expect(loginButton.getAttribute('disabled')).toBeNull()

    await user.click(loginButton)

    expect(deps.loginByEmailUseCase.execute).toHaveBeenCalledWith('user@example.com', 'secret123')
    expect(deps.onFinished).toHaveBeenCalledTimes(1)
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByTestId(LoginByEmailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('triggers onForgotPasswordClick when forgot password button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const forgotBtn = screen.getByTestId(LoginByEmailTestTags.FORGOT_PASSWORD_BUTTON)
    await user.click(forgotBtn)

    expect(deps.onNavigateToForgotPassword).toHaveBeenCalledTimes(1)
  })
})
