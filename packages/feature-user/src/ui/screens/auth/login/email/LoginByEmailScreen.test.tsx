import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestSessionToken, createTestUserPrivate, TEST_EMAIL, TEST_USER_ID, toUserIdOrThrow, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen, LoginByEmailTestTags } from '@/ui/screens/auth/login/email/LoginByEmailScreen'
import { loginByEmailDependenciesMock } from '@/mock/ui/screen/auth/login/email/login-by-email-component-mock'
import { LoginByEmailUseCaseMock } from '@/mock/usecase/auth/login/login-by-email-use-case-mock'

describe('LoginByEmailScreen', () => {
  it('enables login button when valid email and password are provided', async () => {
    const loginByEmailUseCase = new LoginByEmailUseCaseMock()
    loginByEmailUseCase.resultProvider = async () =>
      appResultSuccess({
        userPrivate: createTestUserPrivate({
          id: toUserIdOrThrow(TEST_USER_ID),
          accountStatus: UserAccountStatus.ACTIVE
        }),
        sessionToken: createTestSessionToken()
      })
    vi.spyOn(loginByEmailUseCase, 'execute')

    const onFinished = vi.fn()
    const deps = loginByEmailDependenciesMock({
      loginByEmailUseCase,
      onFinished
    })
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

    await user.type(emailInput, TEST_EMAIL)
    await user.type(passwordInput, 'secret123')

    expect(loginButton.getAttribute('disabled')).toBeNull()

    await user.click(loginButton)

    expect(loginByEmailUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL, 'secret123')
    expect(onFinished).toHaveBeenCalledTimes(1)
  })

  it('triggers onBack when back button is clicked', async () => {
    const onBack = vi.fn()
    const deps = loginByEmailDependenciesMock({ onBack })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByTestId(LoginByEmailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('triggers onForgotPasswordClick when forgot password button is clicked', async () => {
    const onNavigateToForgotPassword = vi.fn()
    const deps = loginByEmailDependenciesMock({ onNavigateToForgotPassword })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const forgotBtn = screen.getByTestId(LoginByEmailTestTags.FORGOT_PASSWORD_BUTTON)
    await user.click(forgotBtn)

    expect(onNavigateToForgotPassword).toHaveBeenCalledTimes(1)
  })
})
