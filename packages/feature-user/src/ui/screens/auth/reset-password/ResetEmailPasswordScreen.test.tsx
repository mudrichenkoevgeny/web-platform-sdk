import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, userStrings, createTestUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { ValidatePasswordUseCaseMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { ResetEmailPasswordScreen } from '@/ui/screens/auth/reset-password/ResetEmailPasswordScreen'
import { ResetPasswordRepositoryMock } from '@/mock/repository/auth/reset-password/reset-password-repository-mock'
import { SendResetPasswordConfirmationToEmailUseCaseMock } from '@/mock/usecase/auth/reset-password/send-reset-password-confirmation-to-email-use-case-mock'
import { ResetEmailPasswordUseCaseMock } from '@/mock/usecase/auth/reset-password/reset-email-password-use-case-mock'
import type { ResetEmailPasswordStoreDependencies } from '@/ui/screens/auth/reset-password/reset-email-password-store'

describe('ResetEmailPasswordScreen', () => {
  const createMockDeps = (): ResetEmailPasswordStoreDependencies => {
    const resetPasswordRepository = new ResetPasswordRepositoryMock()
    vi.spyOn(resetPasswordRepository, 'getRemainingResetPasswordConfirmationDelayInSeconds').mockReturnValue(0)

    const sendResetPasswordConfirmationToEmailUseCase = new SendResetPasswordConfirmationToEmailUseCaseMock()
    sendResetPasswordConfirmationToEmailUseCase.resultProvider = async () =>
      appResultSuccess({
        retryAfterSeconds: 30,
        numberOfSymbols: 6,
        expirationSeconds: 300
      })
    vi.spyOn(sendResetPasswordConfirmationToEmailUseCase, 'execute').mockImplementation(
      sendResetPasswordConfirmationToEmailUseCase.execute.bind(sendResetPasswordConfirmationToEmailUseCase)
    )

    const resetEmailPasswordUseCase = new ResetEmailPasswordUseCaseMock()
    resetEmailPasswordUseCase.resultProvider = async () => appResultSuccess(createTestUserIdentifierPrivate())
    vi.spyOn(resetEmailPasswordUseCase, 'execute').mockImplementation(
      resetEmailPasswordUseCase.execute.bind(resetEmailPasswordUseCase)
    )

    const validatePasswordUseCase = new ValidatePasswordUseCaseMock()
    validatePasswordUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(validatePasswordUseCase, 'execute').mockImplementation(
      validatePasswordUseCase.execute.bind(validatePasswordUseCase)
    )

    return {
      resetPasswordRepository,
      sendResetPasswordConfirmationToEmailUseCase,
      resetEmailPasswordUseCase,
      validatePasswordUseCase,
      onBack: vi.fn(),
      onFinished: vi.fn()
    }
  }

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
    await user.type(emailInput, TEST_EMAIL)

    expect(sendCodeBtn.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeBtn)

    expect(deps.sendResetPasswordConfirmationToEmailUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL)
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
    await user.type(emailInput, TEST_EMAIL)

    const sendCodeBtn = screen.getByRole('button', { name: userStrings.ui.sendCode })
    await user.click(sendCodeBtn)

    const codeInput = await screen.findByPlaceholderText(userStrings.ui.confirmationCode)
    const passwordInput = screen.getByPlaceholderText(userStrings.ui.newPassword)

    await user.type(codeInput, '123456')
    await user.type(passwordInput, 'NewPassword123!')

    const confirmBtn = screen.getByRole('button', { name: userStrings.ui.dialogConfirm })
    await user.click(confirmBtn)

    expect(deps.resetEmailPasswordUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL, 'NewPassword123!', '123456')
    expect(deps.onFinished).toHaveBeenCalledTimes(1)
  })
})
