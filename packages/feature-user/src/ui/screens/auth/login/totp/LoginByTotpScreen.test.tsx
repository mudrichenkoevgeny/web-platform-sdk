import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestSessionToken, createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow, UserAccountStatus, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByTotpScreen } from '@/ui/screens/auth/login/totp/LoginByTotpScreen'
import { loginByTotpDependenciesMock } from '@/mock/ui/screen/auth/login/totp/login-by-totp-component-mock'
import { LoginByTotpUseCaseMock } from '@/mock/usecase/auth/login/login-by-totp-use-case-mock'

describe('LoginByTotpScreen', () => {
  it('renders TOTP mode by default and enables submit when 6 digits are typed', async () => {
    const loginByTotpUseCase = new LoginByTotpUseCaseMock()
    loginByTotpUseCase.resultProvider = async () =>
      appResultSuccess({
        userPrivate: createTestUserPrivate({
          id: toUserIdOrThrow(TEST_USER_ID),
          accountStatus: UserAccountStatus.ACTIVE
        }),
        sessionToken: createTestSessionToken()
      })
    vi.spyOn(loginByTotpUseCase, 'execute')

    const onFinished = vi.fn()
    const deps = loginByTotpDependenciesMock({
      loginByTotpUseCase,
      onFinished
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByTotpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.loginByTotp)).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: userStrings.ui.login })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, '123456')

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(loginByTotpUseCase.execute).toHaveBeenCalledWith('mock_mfa_token', '123456')
    expect(onFinished).toHaveBeenCalledTimes(1)
  })

  it('toggles mode to recovery code when toggle button is clicked', async () => {
    const onModeChange = vi.fn()
    const deps = loginByTotpDependenciesMock({ onModeChange })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByTotpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const toggleBtn = screen.getByRole('button', { name: userStrings.ui.useRecoveryCode })
    await user.click(toggleBtn)

    expect(onModeChange).toHaveBeenCalledWith('recovery_code')
  })
})
