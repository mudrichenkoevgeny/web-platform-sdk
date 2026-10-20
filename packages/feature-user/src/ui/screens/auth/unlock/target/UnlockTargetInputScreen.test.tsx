import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, TEST_PHONE, UnlockMethod, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockTargetInputScreen } from '@/ui/screens/auth/unlock/target/UnlockTargetInputScreen'
import { SendUnlockEmailConfirmationUseCaseMock } from '@/mock/usecase/auth/unlock/send-unlock-email-confirmation-use-case-mock'
import { SendUnlockPhoneConfirmationUseCaseMock } from '@/mock/usecase/auth/unlock/send-unlock-phone-confirmation-use-case-mock'
import type { UnlockTargetInputStoreDependencies } from '@/ui/screens/auth/unlock/target/unlock-target-input-store'

describe('UnlockTargetInputScreen', () => {
  const createMockDeps = (method: UnlockMethod = UnlockMethod.EMAIL): UnlockTargetInputStoreDependencies => {
    const sendUnlockEmailConfirmationUseCase = new SendUnlockEmailConfirmationUseCaseMock()
    sendUnlockEmailConfirmationUseCase.resultProvider = async () => appResultSuccess({ retryAfterSeconds: 30, numberOfSymbols: 6, expirationSeconds: 300 })
    vi.spyOn(sendUnlockEmailConfirmationUseCase, 'execute').mockImplementation(sendUnlockEmailConfirmationUseCase.execute.bind(sendUnlockEmailConfirmationUseCase))

    const sendUnlockPhoneConfirmationUseCase = new SendUnlockPhoneConfirmationUseCaseMock()
    sendUnlockPhoneConfirmationUseCase.resultProvider = async () => appResultSuccess({ retryAfterSeconds: 30, numberOfSymbols: 6, expirationSeconds: 300 })
    vi.spyOn(sendUnlockPhoneConfirmationUseCase, 'execute').mockImplementation(sendUnlockPhoneConfirmationUseCase.execute.bind(sendUnlockPhoneConfirmationUseCase))

    return {
      method,
      sendUnlockEmailConfirmationUseCase,
      sendUnlockPhoneConfirmationUseCase,
      onNavigateToOtp: vi.fn(),
      onBack: vi.fn()
    }
  }

  it('renders email input for EMAIL method and triggers send code on submit', async () => {
    const deps = createMockDeps(UnlockMethod.EMAIL)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockTargetInputScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.unlockByEmail)).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: userStrings.ui.sendCode })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, TEST_EMAIL)

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(deps.sendUnlockEmailConfirmationUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL)
    expect(deps.onNavigateToOtp).toHaveBeenCalledWith(TEST_EMAIL, 30, 'email')
  })

  it('renders phone input for PHONE method and triggers send code on submit', async () => {
    const deps = createMockDeps(UnlockMethod.PHONE)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockTargetInputScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.unlockByPhone)).toBeDefined()

    const input = screen.getByPlaceholderText(userStrings.ui.enterPhoneNumber)
    await user.type(input, TEST_PHONE)

    const submitBtn = screen.getByRole('button', { name: userStrings.ui.sendCode })
    await user.click(submitBtn)

    expect(deps.sendUnlockPhoneConfirmationUseCase.execute).toHaveBeenCalledWith(TEST_PHONE)
    expect(deps.onNavigateToOtp).toHaveBeenCalledWith(TEST_PHONE, 30, 'phone')
  })
})
