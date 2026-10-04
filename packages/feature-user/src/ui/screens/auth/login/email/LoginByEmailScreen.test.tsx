import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen } from './LoginByEmailScreen'
import { LoginByEmailStoreDependencies } from './LoginByEmailStore'
import { enUserStrings } from '@/locales/index'

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
    } as any,
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

    const loginButton = screen.getByRole('button', { name: enUserStrings.login })
    expect(loginButton.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByPlaceholderText(enUserStrings.email)
    const passwordInput = screen.getByPlaceholderText(enUserStrings.password)

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

    const backButton = screen.getByRole('button', { name: 'Go back' })
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

    const forgotBtn = screen.getByRole('button', { name: enUserStrings.forgot_password })
    await user.click(forgotBtn)

    expect(deps.onNavigateToForgotPassword).toHaveBeenCalledTimes(1)
  })
})
