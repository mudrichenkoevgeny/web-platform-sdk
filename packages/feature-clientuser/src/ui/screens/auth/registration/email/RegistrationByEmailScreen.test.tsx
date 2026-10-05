import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { RegistrationByEmailScreen } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'

describe('RegistrationByEmailScreen', () => {
  const createMockDeps = (): RegistrationByEmailStoreDependencies => ({
    registrationRepository: {
      getRemainingRegistrationConfirmationDelayInSeconds: vi.fn().mockReturnValue(0)
    } as any,
    sendRegistrationConfirmationToEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({ retryAfterSeconds: 60 })
      )
    } as any,
    registrationByEmailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userDetails: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as any,
    validatePasswordUseCase: {
      execute: vi.fn().mockReturnValue({ isValid: true, errors: [] })
    } as any,
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

    const sendCodeButton = screen.getByRole('button', { name: enUserStrings.send_code })
    expect(sendCodeButton.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByPlaceholderText(enUserStrings.email)
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

    const backButton = screen.getByRole('button', { name: 'Go back' })
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
