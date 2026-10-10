import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RegistrationByEmailScreen, RegistrationByEmailTestTags } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'

describe('RegistrationByEmailScreen', () => {
  const createMockDeps = (): RegistrationByEmailStoreDependencies => ({
    registrationRepository: {
      getRemainingRegistrationConfirmationDelayInSeconds: vi.fn().mockReturnValue(0)
    } as unknown as RegistrationByEmailStoreDependencies['registrationRepository'],
    sendRegistrationConfirmationToEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({ retryAfterSeconds: 60 })
      )
    } as unknown as RegistrationByEmailStoreDependencies['sendRegistrationConfirmationToEmailUseCase'],
    registrationByEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userPrivate: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as unknown as RegistrationByEmailStoreDependencies['registrationByEmailUseCase'],
    validatePasswordUseCase: {
      execute: vi.fn().mockReturnValue({ success: true, data: undefined })
    } as unknown as RegistrationByEmailStoreDependencies['validatePasswordUseCase'],
    onBack: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders email input and enables send code button for valid email', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <RegistrationByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sendCodeButton = screen.getByTestId(RegistrationByEmailTestTags.SEND_CODE_BUTTON)
    expect(sendCodeButton.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByTestId(RegistrationByEmailTestTags.EMAIL_INPUT)
    await user.type(emailInput, 'user@example.com')

    expect(sendCodeButton.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeButton)

    expect(deps.sendRegistrationConfirmationToEmailUseCase.execute).toHaveBeenCalledWith('user@example.com')
  })

  it('triggers onBack when back button is clicked on initial step', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <RegistrationByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByTestId(RegistrationByEmailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
