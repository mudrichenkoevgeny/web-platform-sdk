import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, UnlockMethod, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockOtpScreen } from '@/ui/screens/auth/unlock/otp/UnlockOtpScreen'
import { UnlockByEmailUseCaseMock } from '@/mock/usecase/auth/unlock/unlock-by-email-use-case-mock'
import { UnlockByPhoneUseCaseMock } from '@/mock/usecase/auth/unlock/unlock-by-phone-use-case-mock'
import { SendUnlockEmailConfirmationUseCaseMock } from '@/mock/usecase/auth/unlock/send-unlock-email-confirmation-use-case-mock'
import { SendUnlockPhoneConfirmationUseCaseMock } from '@/mock/usecase/auth/unlock/send-unlock-phone-confirmation-use-case-mock'
import type { UnlockOtpStoreDependencies } from '@/ui/screens/auth/unlock/otp/unlock-otp-store'

describe('UnlockOtpScreen', () => {
  const createMockDeps = (): UnlockOtpStoreDependencies => {
    const unlockByEmailUseCase = new UnlockByEmailUseCaseMock()
    vi.spyOn(unlockByEmailUseCase, 'execute')

    const unlockByPhoneUseCase = new UnlockByPhoneUseCaseMock()
    vi.spyOn(unlockByPhoneUseCase, 'execute')

    const sendUnlockEmailConfirmationUseCase = new SendUnlockEmailConfirmationUseCaseMock()
    vi.spyOn(sendUnlockEmailConfirmationUseCase, 'execute')

    const sendUnlockPhoneConfirmationUseCase = new SendUnlockPhoneConfirmationUseCaseMock()
    vi.spyOn(sendUnlockPhoneConfirmationUseCase, 'execute')

    return {
      method: UnlockMethod.EMAIL,
      target: TEST_EMAIL,
      initialDelaySeconds: 0,
      unlockByEmailUseCase,
      unlockByPhoneUseCase,
      sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase,
      onUnlockSuccess: vi.fn(),
      onBack: vi.fn()
    }
  }

  it('renders target and unlocks account when code is submitted', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockOtpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(TEST_EMAIL)).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: userStrings.ui.unlockAccount })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, '123456')

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(deps.unlockByEmailUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL, '123456')
    expect(deps.onUnlockSuccess).toHaveBeenCalledTimes(1)
  })

  it('triggers resend code when resend button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockOtpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const resendBtn = screen.getByRole('button', { name: userStrings.ui.resendCode })
    await user.click(resendBtn)

    expect(deps.sendUnlockEmailConfirmationUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL)
  })
})
