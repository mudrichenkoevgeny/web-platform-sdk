import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockTargetInputScreen } from '@/ui/screens/auth/unlock/target/UnlockTargetInputScreen'
import type { UnlockTargetInputStoreDependencies } from '@/ui/screens/auth/unlock/target/UnlockTargetInputStore'
import { enUserStrings } from '@/locales/index'

describe('UnlockTargetInputScreen', () => {
  const createMockDeps = (method: UnlockMethod = UnlockMethod.EMAIL): UnlockTargetInputStoreDependencies => ({
    method,
    sendUnlockEmailConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 30 }))
    } as any,
    sendUnlockPhoneConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 30 }))
    } as any,
    onNavigateToOtp: vi.fn(),
    onBack: vi.fn()
  })

  it('renders email input for EMAIL method and triggers send code on submit', async () => {
    const deps = createMockDeps(UnlockMethod.EMAIL)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockTargetInputScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.unlock_by_email)).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: enUserStrings.send_code })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, 'user@example.com')

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(deps.sendUnlockEmailConfirmationUseCase.execute).toHaveBeenCalledWith('user@example.com')
    expect(deps.onNavigateToOtp).toHaveBeenCalledWith('user@example.com', 30)
  })

  it('renders phone input for PHONE method and triggers send code on submit', async () => {
    const deps = createMockDeps(UnlockMethod.PHONE)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockTargetInputScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.unlock_by_phone)).toBeDefined()

    const input = screen.getByPlaceholderText(enUserStrings.enter_phone_number)
    await user.type(input, '+1234567890')

    const submitBtn = screen.getByRole('button', { name: enUserStrings.send_code })
    await user.click(submitBtn)

    expect(deps.sendUnlockPhoneConfirmationUseCase.execute).toHaveBeenCalledWith('+1234567890')
    expect(deps.onNavigateToOtp).toHaveBeenCalledWith('+1234567890', 30)
  })
})
