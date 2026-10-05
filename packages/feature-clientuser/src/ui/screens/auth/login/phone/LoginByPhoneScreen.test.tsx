import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { LoginByPhoneScreen } from '@/ui/screens/auth/login/phone/LoginByPhoneScreen'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

describe('LoginByPhoneScreen', () => {
  const createMockDeps = (): LoginByPhoneStoreDependencies => ({
    loginRepository: {
      getRemainingLoginConfirmationDelayInSeconds: vi.fn().mockReturnValue(0)
    } as any,
    sendLoginConfirmationToPhoneUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({ retryAfterSeconds: 60 })
      )
    } as any,
    loginByPhoneUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userDetails: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as any,
    onNavigateToTotp: vi.fn(),
    onNavigateToPendingDeletion: vi.fn(),
    onNavigateToAccountUnlock: vi.fn(),
    onBack: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders phone input and enables send code button for valid phone number', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByPhoneScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sendCodeButton = screen.getByRole('button', { name: enUserStrings.send_code })
    expect(sendCodeButton.getAttribute('disabled')).not.toBeNull()

    const phoneInput = screen.getByPlaceholderText(enUserStrings.phone_number)
    await user.type(phoneInput, '+12345678901')

    expect(sendCodeButton.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeButton)

    expect(deps.sendLoginConfirmationToPhoneUseCase.execute).toHaveBeenCalledWith('+12345678901')
  })

  it('triggers onBack when back button is clicked on phone step', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByPhoneScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByRole('button', { name: 'Go back' })
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
