import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethodSelectionScreen } from '@/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen'
import type { UnlockMethodSelectionStoreDependencies } from '@/ui/screens/auth/unlock/selection/unlock-method-selection-store'
import { enUserStrings } from '@/locales/index'

describe('UnlockMethodSelectionScreen', () => {
  const createMockDeps = (): UnlockMethodSelectionStoreDependencies => ({
    lockoutType: AccountLockoutType.TEMPORARY,
    lockoutUntil: Date.now() + 300000,
    getUserIdentifiersUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: []
        })
      )
    } as any,
    unlockByGoogleUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    onNavigateToEmailInput: vi.fn(),
    onNavigateToPhoneInput: vi.fn(),
    onUnlockSuccess: vi.fn(),
    onBack: vi.fn()
  })

  it('renders unlock options and navigates to email input step', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockMethodSelectionScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.unlock_choose_method)).toBeDefined()

    const emailBtn = screen.getByRole('button', { name: enUserStrings.unlock_by_email })
    await user.click(emailBtn)

    expect(deps.onNavigateToEmailInput).toHaveBeenCalledTimes(1)
  })

  it('triggers Google unlock on click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockMethodSelectionScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const googleBtn = screen.getByRole('button', { name: enUserStrings.unlock_by_google })
    await user.click(googleBtn)

    expect(deps.unlockByGoogleUseCase?.execute).toHaveBeenCalledTimes(1)
    expect(deps.onUnlockSuccess).toHaveBeenCalledTimes(1)
  })
})
