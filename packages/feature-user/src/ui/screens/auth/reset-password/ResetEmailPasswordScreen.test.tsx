import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ResetEmailPasswordScreen } from '@/ui/screens/auth/resetpassword/ResetEmailPasswordScreen'
import type { ResetEmailPasswordStoreDependencies } from '@/ui/screens/auth/resetpassword/ResetEmailPasswordStore'
import { enUserStrings } from '@/locales/index'

describe('ResetEmailPasswordScreen', () => {
  const createMockDeps = (): ResetEmailPasswordStoreDependencies => ({
    resetPasswordRepository: {
      getRemainingResetPasswordConfirmationDelayInSeconds: vi.fn().mockReturnValue(0)
    } as any,
    sendResetPasswordConfirmationToEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          retryAfterSeconds: 30
        })
      )
    } as any,
    resetEmailPasswordUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    validatePasswordUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
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

    expect(screen.getByText(enUserStrings.reset_password)).toBeDefined()

    const sendCodeBtn = screen.getByRole('button', { name: enUserStrings.send_code })
    expect(sendCodeBtn.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByRole('textbox')
    await user.type(emailInput, 'user@example.com')

    expect(sendCodeBtn.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeBtn)

    expect(deps.sendResetPasswordConfirmationToEmailUseCase.execute).toHaveBeenCalledWith('user@example.com')
    expect(await screen.findByText(enUserStrings.enter_confirmation_code)).toBeDefined()
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

    const sendCodeBtn = screen.getByRole('button', { name: enUserStrings.send_code })
    await user.click(sendCodeBtn)

    const codeInput = await screen.findByPlaceholderText(enUserStrings.confirmation_code)
    const passwordInput = screen.getByPlaceholderText(enUserStrings.new_password)

    await user.type(codeInput, '123456')
    await user.type(passwordInput, 'NewPassword123!')

    const confirmBtn = screen.getByRole('button', { name: enUserStrings.confirm })
    await user.click(confirmBtn)

    expect(deps.resetEmailPasswordUseCase.execute).toHaveBeenCalledWith('user@example.com', 'NewPassword123!', '123456')
    expect(deps.onFinished).toHaveBeenCalledTimes(1)
  })
})
