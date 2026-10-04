import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockOtpScreen } from './UnlockOtpScreen'
import { UnlockOtpStoreDependencies } from './UnlockOtpStore'
import { enUserStrings } from '@/locales/index'

describe('UnlockOtpScreen', () => {
  const createMockDeps = (): UnlockOtpStoreDependencies => ({
    method: UnlockMethod.EMAIL,
    target: 'user@example.com',
    initialDelaySeconds: 0,
    unlockByEmailUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    unlockByPhoneUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    sendUnlockEmailConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 30 }))
    } as any,
    sendUnlockPhoneConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 30 }))
    } as any,
    onUnlockSuccess: vi.fn(),
    onBack: vi.fn()
  })

  it('renders target and unlocks account when code is submitted', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockOtpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText('user@example.com')).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: enUserStrings.unlock_account })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, '123456')

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(deps.unlockByEmailUseCase.execute).toHaveBeenCalledWith('user@example.com', '123456')
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

    const resendBtn = screen.getByRole('button', { name: enUserStrings.resend_code })
    await user.click(resendBtn)

    expect(deps.sendUnlockEmailConfirmationUseCase.execute).toHaveBeenCalledWith('user@example.com')
  })
})
