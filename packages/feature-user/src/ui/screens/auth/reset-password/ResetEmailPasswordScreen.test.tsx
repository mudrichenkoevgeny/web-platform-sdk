import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { ResetEmailPasswordScreen } from '@/ui/screens/auth/reset-password/ResetEmailPasswordScreen'
import type { ResetEmailPasswordStoreDependencies } from '@/ui/screens/auth/reset-password/reset-email-password-store'

const userStrings = new UserModuleStrings()

describe('ResetEmailPasswordScreen', () => {
  const createMockDeps = (): ResetEmailPasswordStoreDependencies => ({
    resetPasswordRepository: {
      getRemainingResetPasswordConfirmationDelayInSeconds: vi.fn().mockReturnValue(0)
    } as unknown as ResetEmailPasswordStoreDependencies['resetPasswordRepository'],
    sendResetPasswordConfirmationToEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          retryAfterSeconds: 30
        })
      )
    } as unknown as ResetEmailPasswordStoreDependencies['sendResetPasswordConfirmationToEmailUseCase'],
    resetEmailPasswordUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ResetEmailPasswordStoreDependencies['resetEmailPasswordUseCase'],
    validatePasswordUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ResetEmailPasswordStoreDependencies['validatePasswordUseCase'],
    onBack: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders email input step initially and sends code on submit', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ResetEmailPasswordScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.resetPassword)).toBeDefined()

    const sendCodeBtn = screen.getByRole('button', { name: userStrings.ui.sendCode })
    expect(sendCodeBtn.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByRole('textbox')
    await user.type(emailInput, 'user@example.com')

    expect(sendCodeBtn.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeBtn)

    expect(deps.sendResetPasswordConfirmationToEmailUseCase.execute).toHaveBeenCalledWith('user@example.com')
    expect(await screen.findByText(userStrings.ui.enterConfirmationCode)).toBeDefined()
  })

  it('submits code and new password to complete reset on second step', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ResetEmailPasswordScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const emailInput = screen.getByRole('textbox')
    await user.type(emailInput, 'user@example.com')

    const sendCodeBtn = screen.getByRole('button', { name: userStrings.ui.sendCode })
    await user.click(sendCodeBtn)

    const codeInput = await screen.findByPlaceholderText(userStrings.ui.confirmationCode)
    const passwordInput = screen.getByPlaceholderText(userStrings.ui.newPassword)

    await user.type(codeInput, '123456')
    await user.type(passwordInput, 'NewPassword123!')

    const confirmBtn = screen.getByRole('button', { name: userStrings.ui.confirm })
    await user.click(confirmBtn)

    expect(deps.resetEmailPasswordUseCase.execute).toHaveBeenCalledWith('user@example.com', 'NewPassword123!', '123456')
    expect(deps.onFinished).toHaveBeenCalledTimes(1)
  })
})
